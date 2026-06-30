export interface NewspaperEdition {
  id: string
  date: string        // YYYY-MM-DD
  edition: string     // e.g. "Delhi" or "Mumbai"
  sourceUrl: string   // original page or download link
  downloadTime: string // ISO timestamp
  fileSize: string    // e.g. "12.4 MB"
  checksum: string    // unique hash or identifier
  downloadStatus: 'Downloaded' | 'Pending Download' | 'Failed'
  localFileUrl: string // Path to file served locally (e.g. /archive/mint/...)
}

export interface NewspaperProvider {
  providerId: string  // e.g. "mint"
  providerName: string // e.g. "Mint"
  fetchLatestEdition(): Promise<NewspaperEdition | null>
  downloadEdition(edition: NewspaperEdition): Promise<NewspaperEdition>
}
