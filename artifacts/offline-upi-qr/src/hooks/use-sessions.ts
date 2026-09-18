import { useCallback, useEffect, useState } from 'react';
import type { PaymentSession } from '@/lib/models';
import { getSession, getSessions, saveSession, updateSession } from '@/lib/storage';

export function useSessions() {
  const [sessions, setSessions] = useState<PaymentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setLoading(true); setSessions(await getSessions()); setLoading(false); }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const create = useCallback(async (session: PaymentSession) => { await saveSession(session); setSessions((current) => [session, ...current.filter((item) => item.transactionId !== session.transactionId)]); }, []);
  return { sessions, loading, refresh, create };
}

export function useSession(transactionId?: string) {
  const [session, setSession] = useState<PaymentSession>();
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { if (!transactionId) { setLoading(false); return; } setLoading(true); setSession(await getSession(transactionId)); setLoading(false); }, [transactionId]);
  useEffect(() => { void refresh(); }, [refresh]);
  const update = useCallback(async (next: PaymentSession) => { await updateSession(next); setSession(next); }, []);
  return { session, loading, refresh, update };
}