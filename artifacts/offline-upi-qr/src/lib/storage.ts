import type { PaymentSession } from '@/lib/models';
import { openDB, type DBSchema } from 'idb';

const DB_NAME = 'offline-upi-db';
const STORE = 'paymentSessions';
const memory = new Map<string, PaymentSession>();

interface OfflineUpiDb extends DBSchema {
  paymentSessions: {
    key: string;
    value: PaymentSession;
  };
}

function openDb() {
  return openDB<OfflineUpiDb>(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE, { keyPath: 'transactionId' });
      }
    },
  });
}

export async function saveSession(session: PaymentSession): Promise<void> {
  memory.set(session.transactionId, session);
  try {
    const db = await openDb();
    await db.put(STORE, session);
  } catch {
    localStorage.setItem(`upi-session-${session.transactionId}`, JSON.stringify(session));
  }
}

export async function getSession(id: string): Promise<PaymentSession | undefined> {
  if (memory.has(id)) return memory.get(id);
  try {
    const db = await openDb();
    const found = await db.get(STORE, id);
    if (found) memory.set(id, found);
    return found;
  } catch {
    const raw = localStorage.getItem(`upi-session-${id}`);
    return raw ? JSON.parse(raw) as PaymentSession : undefined;
  }
}

export async function getSessions(): Promise<PaymentSession[]> {
  try {
    const db = await openDb();
    const items = await db.getAll(STORE);
    items.forEach((item) => memory.set(item.transactionId, item));
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    const items: PaymentSession[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith('upi-session-')) continue;
      const raw = localStorage.getItem(key);
      if (raw) items.push(JSON.parse(raw) as PaymentSession);
    }
    items.forEach((item) => memory.set(item.transactionId, item));
    return [...items, ...Array.from(memory.values()).filter((item) => !items.some((stored) => stored.transactionId === item.transactionId))]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export async function updateSession(session: PaymentSession): Promise<void> { await saveSession(session); }