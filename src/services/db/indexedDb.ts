import { openDB } from 'idb'

const DB_NAME = 'tingting-db'
const STORE = 'history'

export interface PracticeSession {
  createdAt: number
  transcriptText: string
  selectedKeywords: string[]
}

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'createdAt' })
      }
    },
  })
}

export async function saveSession(session: PracticeSession) {
  const db = await getDB()
  await db.put(STORE, session)
}

export async function listSessions(): Promise<PracticeSession[]> {
  const db = await getDB()
  const tx = db.transaction(STORE)
  const store = tx.store
  const all: PracticeSession[] = []
  let cursor = await store.openCursor(null, 'prev')
  while (cursor) {
    all.push(cursor.value as PracticeSession)
    cursor = await cursor.continue()
  }
  return all
}