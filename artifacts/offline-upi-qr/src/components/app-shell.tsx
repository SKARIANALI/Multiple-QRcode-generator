import { History, Home, Settings, Wifi, WifiOff, QrCode } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useEffect, useState, type ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Create QR', icon: Home, testId: 'link-create-qr' },
  { href: '/history', label: 'History', icon: History, testId: 'link-history' },
  { href: '/settings', label: 'Settings', icon: Settings, testId: 'link-settings' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true); const off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  const pageTitle = location === '/' ? 'Create payment QR' : location.startsWith('/history') ? 'Saved sessions' : location.startsWith('/settings') ? 'Settings' : 'Payment session';
  return (
    <div className="app-noise min-h-[100dvh] bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] md:flex">
        <Link href="/" className="mb-12 flex items-center gap-3" data-testid="link-brand">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"><QrCode size={21} strokeWidth={2.5} /></span>
          <span><span className="block text-[15px] font-extrabold tracking-tight">Offline UPI</span><span className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[hsl(var(--sidebar-foreground)/.58)]">quietly ready</span></span>
        </Link>
        <nav className="space-y-2" aria-label="Primary navigation">
          {navItems.map(({ href, label, icon: Icon, testId }) => {
            const active = href === '/' ? location === '/' : location.startsWith(href);
            return <Link key={href} href={href} data-testid={testId} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--accent))]' : 'text-[hsl(var(--sidebar-foreground)/.68)] hover:bg-[hsl(var(--sidebar-accent)/.7)] hover:text-[hsl(var(--sidebar-foreground))]'}`}><Icon size={18} /><span>{label}</span>{active && <span className="ml-auto size-1.5 rounded-full bg-[hsl(var(--accent))]" />}</Link>;
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.55)] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold"><span className={`size-2 rounded-full ${online ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--destructive))]'}`} />{online ? 'Online' : 'Offline mode'}</div>
          <p className="text-[11px] leading-relaxed text-[hsl(var(--sidebar-foreground)/.58)]">Your sessions stay on this device. No bank connection, no account required.</p>
        </div>
      </aside>
      <main className="min-h-[100dvh] md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md md:px-10">
          <div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-muted-foreground">Offline utility / {pageTitle}</p><h1 className="mt-1 text-sm font-bold tracking-tight md:text-base">{pageTitle}</h1></div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground" data-testid="status-network">
            {online ? <Wifi size={13} className="text-primary" /> : <WifiOff size={13} className="text-destructive" />}<span className="hidden sm:inline">{online ? 'Ready offline' : 'Offline'}</span>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-8 md:px-10 md:pb-12 md:pt-10">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[70px] items-center justify-around border-t border-border bg-card/95 px-5 backdrop-blur-lg md:hidden" aria-label="Mobile navigation">
        {navItems.map(({ href, label, icon: Icon, testId }) => {
          const active = href === '/' ? location === '/' : location.startsWith(href);
          return <Link key={href} href={href} data-testid={`${testId}-mobile`} className={`flex min-w-[76px] flex-col items-center gap-1 text-[10px] font-bold ${active ? 'text-primary' : 'text-muted-foreground'}`}><Icon size={19} /><span>{label}</span></Link>;
        })}
      </nav>
    </div>
  );
}