"use client";
/**
 * Proof-of-work files (screenshots, PDFs) live in this browser's IndexedDB — localStorage only holds
 * text and is capped at about 5 MB. Keys are per user, so two learners on one browser stay separate.
 */
const DB_NAME = "groundwork-files";
const STORE = "files";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type StoredFile = { blob: Blob; name: string; mime: string };

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const idb = await open();
  return new Promise<T>((resolve, reject) => {
    const req = fn(idb.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  }).finally(() => idb.close());
}

export const putFile = (key: string, file: StoredFile) => tx<IDBValidKey>("readwrite", (s) => s.put(file, key));
export const getFile = (key: string) => tx<StoredFile | undefined>("readonly", (s) => s.get(key));
export const deleteFile = (key: string) => tx<undefined>("readwrite", (s) => s.delete(key));
export const listFileKeys = () => tx<IDBValidKey[]>("readonly", (s) => s.getAllKeys());
