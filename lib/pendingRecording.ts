// lib/pendingRecording.ts
//
// Why IndexedDB instead of localStorage:
//   localStorage has a ~5MB limit and stores strings only.
//   A 3-minute .webm recording is typically 4–12MB.
//   IndexedDB stores raw Blobs up to browser quota (usually gigabytes).
//
// Flow:
//   1. User completes recording but isn't signed in
//   2. We call savePendingRecording(blob) before redirecting to Clerk
//   3. After sign-in, Clerk returns to /record
//   4. page.tsx calls restorePendingRecording() — if a blob exists, upload it
//   5. clearPendingRecording() called on success or error

const DB_NAME = 'wmew-pending'  // "where my evening went"
const STORE   = 'recordings'
const KEY     = 'latest'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}

export async function savePendingRecording(
  blob: Blob,
  mood: string | null,
): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    // Store blob + mood together so we can restore both
    store.put({ blob, mood, savedAt: Date.now() }, KEY)
    tx.oncomplete = () => resolve()
    tx.onerror    = () => reject(tx.error)
  })
}

export async function restorePendingRecording(): Promise<{
  blob: Blob
  mood: string | null
} | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const req   = store.get(KEY)
    req.onsuccess = () => {
      const result = req.result as { blob: Blob; mood: string | null } | undefined
      resolve(result ?? null)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function clearPendingRecording(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    store.delete(KEY)
    tx.oncomplete = () => resolve()
    tx.onerror    = () => reject(tx.error)
  })
}