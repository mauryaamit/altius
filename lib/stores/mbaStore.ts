import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RecallResult, RecallRecord, ContentLedgerEntry, FavoriteEntry } from '@/lib/content/types'

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
  libraryDocuments: PdfDocument[]

  // Actions
  addRecall: (conceptId: string, result: RecallResult) => void
  getRecallForConcept: (conceptId: string) => RecallRecord | undefined
  getConceptsDueForReview: (date?: Date) => RecallRecord[]
  setActiveDate: (date: Date | null) => void
  bumpStreak: () => void

  // Ledger & Favorites Actions
  saveToLedger: (entry: ContentLedgerEntry) => void
  getLedgerEntry: (page: string, contentType: string, subTag: string | null, date: string) => ContentLedgerEntry | undefined
  getUsedTopicKeys: (page: string, contentType: string, subTag: string | null) => string[]
  toggleFavorite: (ledgerId: string, page: string, contentType: string) => void
  isFavorite: (ledgerId: string) => boolean
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
      libraryDocuments: [],

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

      toggleFavorite: (ledgerId, page, contentType) => {
        const { favorites } = get()
        if (favorites[ledgerId]) {
          const newFavorites = { ...favorites }
          delete newFavorites[ledgerId]
          set({ favorites: newFavorites })
        } else {
          const newFavorite: FavoriteEntry = {
            id: ledgerId,
            contentLedgerId: ledgerId,
            savedAt: Date.now(),
            page,
            contentType,
          }
          set({
            favorites: {
              ...favorites,
              [ledgerId]: newFavorite,
            },
          })
        }
      },

      isFavorite: (ledgerId) => {
        return !!get().favorites[ledgerId]
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

