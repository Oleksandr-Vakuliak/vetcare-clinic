// Client-side store for the demo pet account.
// Data lives only in this browser (localStorage). The server snapshot is `null`,
// so the server renders a loading state and the client fills in the data after
// hydration — no mismatch, and never a flash of another language.

import { useSyncExternalStore } from 'react';
import type { AccountState } from '@/lib/account/types';
import { createSeed } from '@/lib/account/seed';
import {
  STORAGE_KEY,
  clearState,
  loadState,
  saveState,
  type StorageLike,
} from '@/lib/account/storage';

let cache: AccountState | null = null;
const listeners = new Set<() => void>();

function storage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null; // blocked cookies / private mode: work in memory
  }
}

function getSnapshot(): AccountState {
  if (!cache) {
    cache = loadState(storage(), new Date()).state;
    // Persist the seed on first visit so its relative dates stay fixed.
    saveState(storage(), cache);
  }
  return cache;
}

function getServerSnapshot(): null {
  return null;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep several open tabs in sync.
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  }
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useAccountState(): AccountState | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateAccount(change: (state: AccountState) => AccountState) {
  cache = change(getSnapshot());
  saveState(storage(), cache);
  emit();
}

export function resetAccount() {
  clearState(storage());
  cache = createSeed(new Date());
  saveState(storage(), cache);
  emit();
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
