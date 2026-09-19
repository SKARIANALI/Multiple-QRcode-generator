import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, X, ArrowUpRight, Zap, Copy, Check } from 'lucide-react';

const SALE_END = 1000 * 60 * 60 * 14 + 1000 * 60 * 23 + 1000 * 47; // 14h 23m 47s

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function App() {
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msLeft, setMsLeft] = useState(SALE_END);

  useEffect(() => {
    const t = setInterval(() => setMsLeft((m) => Math.max(0, m - 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const hrs = Math.floor(msLeft / 3600000);
  const mins = Math.floor((msLeft % 3600000) / 60000);
  const secs = Math.floor((msLeft % 60000) / 1000);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#06060e]">
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&family=Caveat:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        * { -webkit-font-smoothing: antialiased; }
        .y2k-bg {
          background:
            radial-gradient(ellipse 60% 40% at 20% 15%, rgba(255,46,196,0.18), transparent 60%),
            radial-gradient(ellipse 50% 45% at 85% 80%, rgba(0,224,255,0.14), transparent 60%),
            radial-gradient(ellipse 35% 30% at 70% 20%, rgba(200,255,0,0.08), transparent 60%),
            #06060e;
        }
        .grid-floor {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 75%);
        }
        .chrome-frame {
          background: linear-gradient(160deg,
            #fdfdff 0%, #b9c3d4 8%, #f2f6ff 16%, #7e8aa3 28%, #e8edf7 40%,
            #aab4c8 52%, #ffffff 62%, #8d99b0 76%, #e2e8f4 88%, #a4afc4 100%);
          padding: 3px;
          border-radius: 30px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.2),
            0 30px 80px -20px rgba(255,46,196,0.35),
            0 20px 60px -30px rgba(0,224,255,0.4),
            0 10px 40px rgba(0,0,0,0.6);
        }
        .chrome-text {
          background: linear-gradient(180deg, #ffffff 0%, #cfd8e8 35%, #6b7a96 50%, #e9eefb 55%, #ffffff 75%, #9aa7bf 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 1px 0 rgba(0,0,0,0.55)) drop-shadow(0 0 18px rgba(0,224,255,0.25));
        }
        .bubble-pill {
          background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.18));
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 6px rgba(0,0,0,0.3);
        }
        .gloss-btn {
          background: linear-gradient(180deg, #ff7ddd 0%, #ff2ec4 38%, #c4009a 60%, #ff4fd0 100%);
          box-shadow:
            inset 0 2px 1px rgba(255,255,255,0.65),
            inset 0 -3px 8px rgba(80,0,60,0.55),
            0 8px 24px -6px rgba(255,46,196,0.65);
        }
        .gloss-btn::before {
          content: '';
          position: absolute; left: 8%; right: 8%; top: 6%; height: 42%;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0));
          pointer-events: none;
        }
        .chip-glow { box-shadow: 0 0 0 1px rgba(200,255,0,0.4), 0 0 18px -4px rgba(200,255,0,0.5); }
        .ticker-track { display: flex; width: max-content; animation: ticker 14s linear infinite; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .star-spin { animation: spin 9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .scanlines {
          background: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px);
        }
      `,
        }}
      />

      <div className="absolute inset-0 y2k-bg" />
      <div className="grid-floor" />

      {/* phone-width column */}
      <div className="relative w-full max-w-[390px]" style={{ fontFamily: "'Archivo', sans-serif" }}>
        {/* fake status context */}
        <div className="flex items-center justify-between px-2 mb-3 text-[11px] tracking-[0.2em] text-white/40 font-semibold">
          <span>21:47</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] inline-block" />
            HEX&BURN.STUDIO
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!dismissed ? (
            <motion.div
              key="card"
              initial={{ y: -28, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="chrome-frame relative"
            >
              <div className="relative rounded-[27px] overflow-hidden bg-[#0c0c18]">
                <div className="absolute inset-0 scanlines pointer-events-none z-20" />

                {/* ===== Header row ===== */}
                <div className="relative z-10 flex items-center gap-3 px-4 pt-4 pb-3">
                  {/* app icon */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'conic-gradient(from 210deg, #fff, #9aa7bf, #fff, #6b7a96, #e9eefb, #fff)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Sparkles className="star-spin" size={20} strokeWidth={2.4} color="#0c0c18" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-extrabold tracking-[0.08em] text-white uppercase">Hex&Burn</span>
                      <span className="text-[10px] font-bold px-1.5 py-[2px] rounded-md bg-[#C8FF00] text-black tracking-wide chip-glow">
                        PROMO
                      </span>
                    </div>
                    <div className="text-[11px] text-white/45 font-medium">Notifications · now</div>
                  </div>
                  <button
                    onClick={() => setExpanded((e) => !e)}
                    className="bubble-pill w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    aria-label="Expand"
                  >
                    <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>
                  <button
                    onClick={() => setDismissed(true)}
                    className="bubble-pill w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* ===== Hero ===== */}
                <div className="relative z-10 mx-3 rounded-[20px] overflow-hidden border border-white/10">
                  <div
                    className="relative px-5 pt-5 pb-4"
                    style={{
                      background:
                        'radial-gradient(120% 140% at 0% 0%, rgba(255,46,196,0.35), transparent 55%), radial-gradient(120% 140% at 100% 100%, rgba(0,224,255,0.3), transparent 55%), #101022',
                    }}
                  >
                    {/* bubble decorations */}
                    <div
                      className="absolute -right-6 -top-8 w-28 h-28 rounded-full opacity-60 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), rgba(255,255,255,0.12) 38%, rgba(0,224,255,0.12) 70%, transparent)',
                      }}
                    />
                    <div
                      className="absolute -left-4 bottom-2 w-16 h-16 rounded-full opacity-50 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,46,196,0.25) 45%, transparent 75%)',
                      }}
                    />

                    <div
                      className="text-[26px] leading-none mb-1 -rotate-2 origin-left"
                      style={{ fontFamily: "'Caveat', cursive", color: '#C8FF00', textShadow: '0 0 16px rgba(200,255,0,0.45)' }}
                    >
                      taste is dead, long live taste —
                    </div>

                    <div className="flex items-end gap-3">
                      <h1 className="chrome-text font-black leading-[0.85] tracking-[-0.03em]" style={{ fontSize: '64px' }}>
                        50%
                      </h1>
                      <div className="pb-1">
                        <div className="text-white font-extrabold text-[18px] leading-[1.05] tracking-tight uppercase">
                          off every<br />retainer
                        </div>
                        <div className="text-[11px] text-white/50 font-semibold tracking-[0.14em] uppercase mt-1">
                          Y2K WINTER DROP · 72 HRS ONLY
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ticker */}
                  <div className="bg-black/60 border-t border-white/10 overflow-hidden py-[6px]">
                    <div className="ticker-track text-[10px] font-bold tracking-[0.22em] uppercase whitespace-nowrap">
                      {[0, 1].map((i) => (
                        <span key={i} className="flex">
                          {['BRAND SYSTEMS', 'WEB THAT BITES BACK', 'MOTION', 'CAMPAIGNS', 'NAMING', 'NO BEIGE ALLOWED'].map(
                            (t, j) => (
                              <span key={j} className="flex items-center">
                                <span className="px-3 text-white/60">{t}</span>
                                <span className="text-[#FF2EC4]">✦</span>
                              </span>
                            )
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ===== Expandable detail ===== */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div className="px-4 pt-4 space-y-3">
                        {/* countdown */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/45">
                            Offer self-destructs in
                          </span>
                          <div className="flex items-center gap-1.5">
                            {[
                              [pad(hrs), 'H'],
                              [pad(mins), 'M'],
                              [pad(secs), 'S'],
                            ].map(([v, l], i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <div className="bubble-pill rounded-xl px-2.5 py-1.5 min-w-[44px] text-center">
                                  <span className="text-[16px] font-extrabold text-white tabular-nums leading-none">{v}</span>
                                  <span className="text-[9px] font-bold text-[#00E0FF] ml-[2px]">{l}</span>
                                </div>
                                {i < 2 && <span className="text-[#FF2EC4] font-black text-sm">:</span>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* what's included — dense rows */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.06]">
                          {[
                            { label: 'Identity sprint (2 wks)', was: '$18,000', now: '$9,000' },
                            { label: 'Web build · CMS incl.', was: '$24,000', now: '$12,000' },
                            { label: 'Motion / launch kit', was: '$8,500', now: '$4,250' },
                          ].map((r, i) => (
                            <div key={i} className="flex items-center justify-between px-3.5 py-2.5">
                              <span className="text-[12px] font-semibold text-white/85">{r.label}</span>
                              <span className="flex items-center gap-2">
                                <span className="text-[11px] text-white/35 line-through">{r.was}</span>
                                <span className="text-[12px] font-extrabold text-[#C8FF00]">{r.now}</span>
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* promo code */}
                        <button
                          onClick={() => setCopied(true)}
                          className="w-full group flex items-center justify-between rounded-2xl border border-dashed border-[#00E0FF]/50 bg-[#00E0FF]/[0.06] px-3.5 py-2.5 transition-colors hover:bg-[#00E0FF]/[0.12]"
                        >
                          <span className="flex items-center gap-2">
                            <Zap size={14} className="text-[#00E0FF]" />
                            <span className="text-[13px] font-extrabold tracking-[0.18em] text-white">DIAL-UP-50</span>
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#00E0FF]">
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                            {copied ? 'COPIED' : 'TAP TO COPY'}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ===== Actions ===== */}
                <div className="relative z-10 px-4 pt-4 pb-4 flex items-center gap-2.5">
                  <button className="gloss-btn relative flex-1 rounded-full py-3.5 px-5 flex items-center justify-center gap-2 text-white font-extrabold text-[14px] tracking-[0.06em] uppercase active:scale-[0.98] transition-transform">
                    Claim the drop
                    <ArrowUpRight size={17} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => setDismissed(true)}
                    className="bubble-pill rounded-full py-3.5 px-5 text-white/65 hover:text-white text-[13px] font-bold transition-colors"
                  >
                    later
                  </button>
                </div>

                {/* fine print */}
                <div className="relative z-10 px-5 pb-3 -mt-1 flex items-center justify-between">
                  <span className="text-[9px] text-white/30 font-medium tracking-wide">
                    New retainers only · ends 12.31 23:59 GMT · no beige briefs
                  </span>
                  <span
                    className="text-[15px] -rotate-3"
                    style={{ fontFamily: "'Caveat', cursive", color: 'rgba(255,255,255,0.45)' }}
                  >
                    xoxo, hex&burn
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="restore"
              onClick={() => setDismissed(false)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bubble-pill mx-auto block rounded-full px-5 py-3 text-[12px] font-bold tracking-[0.14em] uppercase text-white/70 hover:text-white transition-colors"
            >
              ✦ Notification dismissed — bring it back
            </motion.button>
          )}
        </AnimatePresence>

        {/* stack hint */}
        {!dismissed && (
          <div className="mx-6 mt-[-6px] h-3 rounded-b-2xl bg-white/[0.06] border border-t-0 border-white/10" />
        )}
      </div>
    </div>
  );
}