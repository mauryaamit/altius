import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import type { RecallResult, RecallRecord, ContentLedgerEntry, FavoriteEntry, NoteEntry, JournalEntry } from '@/lib/content/types'

// ─── Spaced-repetition interval schedule (days) ───────────────────────────────
const INTERVALS = [1, 3, 7, 14, 30]

function getNextReviewDate(result: RecallResult, currentDate: Date): string {
  const msPerDay = 86_400_000
  const daysOut = result === 'got-it' ? 7 : result === 'shaky' ? 3 : 1
  const next = new Date(currentDate.getTime() + daysOut * msPerDay)
  return next.toISOString().slice(0, 10)
}

interface PdfDocument {
  id: string
  title: string
  subjectTags: string[]
  uploadedAt: string
  sourceType: string
  fileUrl: string
  pageCount: number
  description: string
}

interface MbaState {
  // Recall records keyed by conceptId
  recallRecords: Record<string, RecallRecord[]>
  // Streak: consecutive days active
  streak: number
  lastActiveDate: string   // ISO date
  // Active date for Archive browsing (null = today)
  activeDate: Date | null

  // Content Ledger & Favorites
  contentLedger: Record<string, ContentLedgerEntry>
  favorites: Record<string, FavoriteEntry>
  textSize: 'compact' | 'default' | 'large'
  libraryDocuments: PdfDocument[]
  
  // Notes & Journal
  notes: Record<string, NoteEntry>
  journal: Record<string, JournalEntry>

  // Actions
  addRecall: (conceptId: string, result: RecallResult) => void
  getRecallForConcept: (conceptId: string) => RecallRecord | undefined
  getConceptsDueForReview: (date?: Date) => RecallRecord[]
  setActiveDate: (date: Date | null) => void
  bumpStreak: () => void
  setTextSize: (size: 'compact' | 'default' | 'large') => void
  
  // Notes & Journal Actions
  saveNote: (contentRef: string, contentTitle: string, contentType: string, page: string, noteText: string) => Promise<void>
  deleteNote: (contentRef: string) => Promise<void>
  saveJournal: (date: string, text: string, promptUsed: string | null) => Promise<void>
  clearNotes: () => Promise<void>
  clearJournal: () => Promise<void>
  syncFromFirestore: (uid: string) => Promise<void>

  // Ledger & Favorites Actions
  saveToLedger: (entry: ContentLedgerEntry) => void
  getLedgerEntry: (page: string, contentType: string, subTag: string | null, date: string) => ContentLedgerEntry | undefined
  getUsedTopicKeys: (page: string, contentType: string, subTag: string | null) => string[]
  toggleFavorite: (ledgerId: string, page: string, contentType: string, type: 'heart' | 'bookmark') => void
  isFavorite: (ledgerId: string, type?: 'heart' | 'bookmark') => boolean
  addToCollection: (ledgerId: string, collectionName: string) => void
  removeFromCollection: (ledgerId: string, collectionName: string) => void
  addLibraryDocument: (doc: PdfDocument) => void
  removeLibraryDocument: (id: string) => void
}

export const useMbaStore = create<MbaState>()(
  persist(
    (set, get) => ({
      recallRecords: {},
      streak: 0,
      lastActiveDate: '',
      activeDate: null,

      contentLedger: {},
      favorites: {},
      textSize: 'default',
      libraryDocuments: [],
      notes: {},
      journal: {},

      addRecall: (conceptId, result) => {
        const today = new Date().toISOString().slice(0, 10)
        const record: RecallRecord = {
          conceptId,
          result,
          date: today,
          nextReviewDate: getNextReviewDate(result, new Date()),
        }
        set((state) => ({
          recallRecords: {
            ...state.recallRecords,
            [conceptId]: [
              ...(state.recallRecords[conceptId] ?? []),
              record,
            ],
          },
        }))
        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'recallRecords', conceptId)
          setDoc(docRef, { records: get().recallRecords[conceptId] }).catch(err => console.error(err))
        }
      },

      getRecallForConcept: (conceptId) => {
        const records = get().recallRecords[conceptId]
        if (!records?.length) return undefined
        return records[records.length - 1]
      },

      getConceptsDueForReview: (date = new Date()) => {
        const today = date.toISOString().slice(0, 10)
        const all = Object.values(get().recallRecords).flat()
        const latest: Record<string, RecallRecord> = {}
        for (const r of all) {
          if (!latest[r.conceptId] || r.date > latest[r.conceptId].date) {
            latest[r.conceptId] = r
          }
        }
        return Object.values(latest).filter((r) => r.nextReviewDate <= today)
      },

      setActiveDate: (date) => set({ activeDate: date }),

      bumpStreak: () => {
        const today = new Date().toISOString().slice(0, 10)
        const { lastActiveDate, streak } = get()
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
        if (lastActiveDate === today) return  // already counted today
        const newStreak = lastActiveDate === yesterday ? streak + 1 : 1
        set({ streak: newStreak, lastActiveDate: today })

        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'settings', 'global')
          setDoc(docRef, { 
            textSize: get().textSize, 
            streak: newStreak, 
            lastActiveDate: today 
          }).catch(err => console.error(err))
        }
      },

      setTextSize: (size) => {
        set({ textSize: size })
        const scaleMap = { compact: '0.9', default: '1.0', large: '1.15' }
        const scaleVal = scaleMap[size] || '1.0'
        if (typeof document !== 'undefined') {
          document.documentElement.style.setProperty('--reading-scale', scaleVal)
        }

        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'settings', 'global')
          setDoc(docRef, { 
            textSize: size, 
            streak: get().streak, 
            lastActiveDate: get().lastActiveDate 
          }).catch(err => console.error(err))
        }
      },

      saveNote: async (contentRef, contentTitle, contentType, page, noteText) => {
        const note: NoteEntry = {
          id: contentRef,
          contentRef,
          contentTitle,
          contentType,
          page,
          noteText,
          updatedAt: Date.now(),
        }
        set((state) => ({
          notes: {
            ...state.notes,
            [contentRef]: note,
          },
        }))
        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'notes', contentRef)
          await setDoc(docRef, note)
        }
      },

      deleteNote: async (contentRef) => {
        set((state) => {
          const updated = { ...state.notes }
          delete updated[contentRef]
          return { notes: updated }
        })
        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'notes', contentRef)
          await deleteDoc(docRef)
        }
      },

      saveJournal: async (date, text, promptUsed) => {
        const entry: JournalEntry = {
          date,
          text,
          wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
          promptUsed,
          updatedAt: Date.now(),
        }
        set((state) => ({
          journal: {
            ...state.journal,
            [date]: entry,
          },
        }))
        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'journal', date)
          await setDoc(docRef, entry)
        }
      },

      clearNotes: async () => {
        set({ notes: {} })
        const currentUser = auth.currentUser
        if (currentUser) {
          const colRef = collection(db, 'users', currentUser.uid, 'notes')
          const snap = await getDocs(colRef)
          const batch = writeBatch(db)
          snap.docs.forEach((d) => batch.delete(d.ref))
          await batch.commit()
        }
      },

      clearJournal: async () => {
        set({ journal: {} })
        const currentUser = auth.currentUser
        if (currentUser) {
          const colRef = collection(db, 'users', currentUser.uid, 'journal')
          const snap = await getDocs(colRef)
          const batch = writeBatch(db)
          snap.docs.forEach((d) => batch.delete(d.ref))
          await batch.commit()
        }
      },

      syncFromFirestore: async (uid) => {
        try {
          // 1. Settings
          const settingsRef = doc(db, 'users', uid, 'settings', 'global')
          const settingsSnap = await getDoc(settingsRef)
          if (settingsSnap.exists()) {
            const data = settingsSnap.data()
            set({
              textSize: data.textSize || 'default',
              streak: data.streak || 0,
              lastActiveDate: data.lastActiveDate || '',
            })
            const scaleMap = { compact: '0.9', default: '1.0', large: '1.15' }
            const scaleVal = scaleMap[data.textSize as 'compact' | 'default' | 'large'] || '1.0'
            if (typeof document !== 'undefined') {
              document.documentElement.style.setProperty('--reading-scale', scaleVal)
            }
          }

          // 2. Recall Records
          const recallRef = collection(db, 'users', uid, 'recallRecords')
          const recallSnap = await getDocs(recallRef)
          const recallRecords: Record<string, RecallRecord[]> = {}
          recallSnap.docs.forEach((d) => {
            recallRecords[d.id] = d.data().records || []
          })
          if (recallSnap.size > 0) set({ recallRecords })

          // 3. Favorites
          const favRef = collection(db, 'users', uid, 'favorites')
          const favSnap = await getDocs(favRef)
          const favorites: Record<string, FavoriteEntry> = {}
          favSnap.docs.forEach((d) => {
            favorites[d.id] = d.data() as FavoriteEntry
          })
          if (favSnap.size > 0) set({ favorites })

          // 4. Notes
          const notesRef = collection(db, 'users', uid, 'notes')
          const notesSnap = await getDocs(notesRef)
          const notes: Record<string, NoteEntry> = {}
          notesSnap.docs.forEach((d) => {
            notes[d.id] = d.data() as NoteEntry
          })
          if (notesSnap.size > 0) set({ notes })

          // 5. Journal
          const journalRef = collection(db, 'users', uid, 'journal')
          const journalSnap = await getDocs(journalRef)
          const journal: Record<string, JournalEntry> = {}
          const pruneThreshold = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
          
          const batch = writeBatch(db)
          let hasPruned = false

          journalSnap.docs.forEach((d) => {
            const dateKey = d.id
            if (dateKey < pruneThreshold) {
              batch.delete(d.ref)
              hasPruned = true
            } else {
              journal[dateKey] = d.data() as JournalEntry
            }
          })

          if (hasPruned) {
            await batch.commit()
          }
          set({ journal })

        } catch (error) {
          console.error('Error syncing from Firestore:', error)
        }
      },

      // Ledger & Favorites implementation
      saveToLedger: (entry) => {
        const key = `${entry.page}_${entry.contentType}_${entry.subTag || ''}_${entry.date}`
        set((state) => ({
          contentLedger: {
            ...state.contentLedger,
            [key]: entry,
          },
        }))
      },

      getLedgerEntry: (page, contentType, subTag, date) => {
        const key = `${page}_${contentType}_${subTag || ''}_${date}`
        return get().contentLedger[key]
      },

      getUsedTopicKeys: (page, contentType, subTag) => {
        const allLedger = Object.values(get().contentLedger)
        return allLedger
          .filter((entry) => entry.page === page && entry.contentType === contentType && entry.subTag === subTag)
          .map((entry) => entry.topicKey)
      },

      toggleFavorite: async (ledgerId, page, contentType, type) => {
        const { favorites } = get()
        const uniqueKey = `${ledgerId}_${type}`
        const existing = favorites[uniqueKey]
        
        let isDeleting = false
        let newFavorite: FavoriteEntry | null = null

        if (existing) {
          const newFavorites = { ...favorites }
          delete newFavorites[uniqueKey]
          set({ favorites: newFavorites })
          isDeleting = true
        } else {
          newFavorite = {
            id: uniqueKey,
            contentLedgerId: ledgerId,
            savedAt: Date.now(),
            page,
            contentType,
            type,
            collections: []
          }
          set({
            favorites: {
              ...favorites,
              [uniqueKey]: newFavorite
            }
          })
        }

        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'favorites', uniqueKey)
          if (isDeleting) {
            await deleteDoc(docRef)
          } else {
            if (newFavorite) {
              await setDoc(docRef, newFavorite)
            }
          }
        }
      },

      isFavorite: (ledgerId, type) => {
        if (type) {
          return !!get().favorites[`${ledgerId}_${type}`]
        }
        return !!get().favorites[`${ledgerId}_heart`] || !!get().favorites[`${ledgerId}_bookmark`]
      },

      addToCollection: async (uniqueKey, collectionName) => {
        const { favorites } = get()
        const fav = favorites[uniqueKey]
        if (!fav) return

        const collections = fav.collections || []
        if (collections.includes(collectionName)) return

        const updatedFav = {
          ...fav,
          collections: [...collections, collectionName]
        }

        set({
          favorites: {
            ...favorites,
            [uniqueKey]: updatedFav
          }
        })

        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'favorites', uniqueKey)
          await setDoc(docRef, updatedFav)
        }
      },

      removeFromCollection: async (uniqueKey, collectionName) => {
        const { favorites } = get()
        const fav = favorites[uniqueKey]
        if (!fav) return

        const collections = fav.collections || []
        const updatedFav = {
          ...fav,
          collections: collections.filter((c) => c !== collectionName)
        }

        set({
          favorites: {
            ...favorites,
            [uniqueKey]: updatedFav
          }
        })

        const currentUser = auth.currentUser
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid, 'favorites', uniqueKey)
          await setDoc(docRef, updatedFav)
        }
      },

      addLibraryDocument: (doc) => {
        set((state) => ({
          libraryDocuments: [doc, ...state.libraryDocuments],
        }))
      },

      removeLibraryDocument: (id) => {
        set((state) => ({
          libraryDocuments: state.libraryDocuments.filter((doc) => doc.id !== id),
        }))
      },
    }),
    { name: 'altius-store' }
  )
)

