// Client-side store of the shared demo model (site calendar, pet account, admin panel).
// Data lives only in this browser (localStorage). The server snapshot is `null`, so
// the server renders a placeholder and the client fills in the data after hydration —
// no mismatch, never a flash of another language.

import { useSyncExternalStore } from 'react';
import type { DemoState } from '@/lib/clinic/types';
import { createSeed } from '@/lib/clinic/seed';
import { clinicNow } from '@/lib/clinic/time';
import {
  STORAGE_KEY,
  clearState,
  loadState,
  saveState,
  type LoadSource,
  type StorageLike,
} from '@/lib/clinic/storage';

export interface DemoSnapshot {
  state: DemoState;
  /** How the data was obtained on load; the UI explains 'migrated' / 'recovered' / 'unavailable'. */
  source: LoadSource;
  /** False when the last change could not be written (quota, blocked storage). */
  saved: boolean;
}

let cache: DemoSnapshot | null = null;
const listeners = new Set<() => void>();

function storage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null; // blocked cookies / private mode: work in memory
  }
}

function getSnapshot(): DemoSnapshot {
  if (!cache) {
    const { state, source } = loadState(storage(), clinicNow());
    // Persist the seed on first visit so its relative dates stay fixed.
    const saved = source === 'stored' || saveState(storage(), state);
    cache = { state, source, saved };
  }
  return cache;
}

function getServerSnapshot(): null {
  return null;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  // Another tab changed or cleared the data (event.key is null on clear()).
  if (event.key === STORAGE_KEY || event.key === null) {
    cache = null;
    emit();
  }
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

export function useDemoSnapshot(): DemoSnapshot | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useDemoState(): DemoState | null {
  return useDemoSnapshot()?.state ?? null;
}

/** Applies a change to the model and saves it. */
export function updateDemo(change: (state: DemoState) => DemoState) {
  const current = getSnapshot();
  const state = change(current.state);
  if (state === current.state) return;
  cache = { state, source: current.source, saved: saveState(storage(), state) };
  emit();
}

/**
 * Runs a model operation on the latest state; saves it when it succeeds.
 * Returns the error code of a refused operation, or null.
 */
export function commitDemo<E extends string>(
  operation: (state: DemoState) => { ok: true; state: DemoState } | { ok: false; error: E },
): E | null {
  const out: { error: E | null } = { error: null };
  updateDemo((state) => {
    const result = operation(state);
    if (result.ok) return result.state;
    out.error = result.error;
    return state;
  });
  return out.error;
}

/** Resets everything (admin data, pet account, calendar) to a fresh seed. */
export function resetDemo() {
  clearState(storage());
  const state = createSeed(clinicNow());
  const saved = saveState(storage(), state);
  cache = { state, source: saved ? 'seed' : 'unavailable', saved };
  emit();
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
