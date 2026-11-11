import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Headphones, Home, MapPin, Receipt, Search, Send, ShoppingCart, User, X, Zap, Plus, ArrowRight, Key, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { Logo, Sheet, SmartImage } from './ui';
import { askKilaAi, generateLocalPersonaReply } from '../data/chatbot';
import { getProduct } from '../data/products';
import { formatRp } from '../data/vouchers';

export default function Header() {
  const { address, addresses, setAddressId, cartCount } = useStore();
  const { query, setQuery, setCategory, go, tab } = useUi();
  const [addrOpen, setAddrOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'Beranda', icon: Home },
    { key: 'orders', label: 'Transaksi', icon: Receipt },
    { key: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white shadow-lg shadow-navy-900/20">
      <div className="mx-auto max-w-6xl px-4 pt-3 pb-4 @3xl:px-6 @3xl:py-4">
        {/* Baris atas */}
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => go('home')} className="shrink-0" aria-label="Beranda BC-LAT">
            <Logo size="md" tagline />
          </button>

          {/* Search versi desktop */}
          <SearchBox query={query} setQuery={setQuery} setCategory={setCategory} go={go} className="hidden flex-1 @3xl:flex" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-bold ring-1 ring-white/15 hover:bg-white/20"
            >
              <Headphones size={16} className="text-gold-400" />
              <span>Chat CS</span>
            </button>
            {/* Navigasi desktop */}
            <nav className="hidden items-center gap-1 @3xl:flex">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => go(key)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold ${tab === key ? 'bg-gold-400 text-navy-900' : 'hover:bg-white/10'}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
              <button
                onClick={() => go('cart')}
                className={`relative ml-1 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${tab === 'cart' ? 'bg-gold-400 text-navy-900' : 'bg-white text-navy-900 hover:bg-gold-300'}`}
              >
                <ShoppingCart size={16} /> Keranjang
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] text-white ring-2 ring-navy-800">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Janji pengiriman + alamat */}
        <div className="mt-3 flex items-center justify-between gap-3 @3xl:mt-3">
          <div>
            <div className="text-[11px] font-medium text-slate-300">Tiba dalam</div>
            <div className="flex items-center gap-1 text-2xl leading-tight font-extrabold @3xl:text-xl">
              <Zap size={20} className="fill-gold-400 text-gold-400" /> 15 Menit
            </div>
            <div className="text-[11px] font-semibold text-slate-200">Buka 24 jam & tersedia &gt;10.000 produk</div>
          </div>
          <button
            onClick={() => setAddrOpen(true)}
            className="flex max-w-[52%] items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-left ring-1 ring-white/15 hover:bg-white/15 @3xl:max-w-sm"
          >
            <MapPin size={18} className="shrink-0 text-gold-400" />
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-slate-300">Antar ke {address?.label}</div>
              <div className="truncate text-xs font-bold">{address?.full}</div>
            </div>
            <ChevronDown size={16} className="shrink-0 text-slate-300" />
          </button>
        </div>

        {/* Search versi mobile */}
        <SearchBox query={query} setQuery={setQuery} setCategory={setCategory} go={go} className="mt-3 flex @3xl:hidden" />
      </div>

      {/* Pilih alamat */}
      <Sheet open={addrOpen} onClose={() => setAddrOpen(false)}>
        <div className="p-5 text-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-navy-900">Mau diantar ke mana?</h3>
            <button onClick={() => setAddrOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-2">
            {addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setAddressId(a.id);
                  setAddrOpen(false);
                }}
                className={`flex w-full gap-3 rounded-2xl border-2 p-3 text-left ${a.id === address?.id ? 'border-gold-500 bg-gold-300/15' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <MapPin className={a.id === address?.id ? 'text-gold-600' : 'text-slate-400'} size={20} />
                <div>
                  <div className="text-sm font-bold text-navy-900">{a.label}</div>
                  <div className="text-xs text-slate-600">{a.full}</div>
                  {a.notes && <div className="mt-1 text-[11px] text-slate-400">Catatan: {a.notes}</div>}
                </div>
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-navy-900/5 p-3 text-xs text-slate-600">
            ⚡ Semua alamat berada dalam radius 3 km dari <b>Dark Store BC-LAT Pamulang (UNPAM)</b> — pengantaran 15 menit dijamin.
          </p>
        </div>
      </Sheet>

      <ChatCS open={chatOpen} onClose={() => setChatOpen(false)} />
    </header>
  );
}

function SearchBox({ query, setQuery, setCategory, go, className }) {
  return (
    <label className={`items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm ring-1 ring-black/5 @3xl:py-2.5 ${className}`}>
      <Search size={20} className="text-slate-400" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setCategory(null);
          go('home');
        }}
        placeholder="Cari produk disini, mis. telur, mie, kopi…"
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
      {query && (
        <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600" aria-label="Hapus pencarian">
          <X size={18} />
        </button>
      )}
    </label>
  );
}

function ChatCS({ open, onClose }) {
  const { addToCart, showToast } = useStore();
  const { go } = useUi();
  const [msgs, setMsgs] = useState([
    {
      from: 'cs',
      text: 'Halo kak! Saya Kila dari BC-LAT ⚡ Ada yang bisa dibantu? Mau cari sembako, snack tengah malam, atau tanya promo?',
    },
  ]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bclat_gemini_key') || '');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, typing]);

  const saveApiKey = (k) => {
    setApiKey(k);
    if (k.trim()) {
      localStorage.setItem('bclat_gemini_key', k.trim());
      showToast('Kunci Gemini AI aktif!', 'success');
    } else {
      localStorage.removeItem('bclat_gemini_key');
      showToast('Kunci AI dihapus, kembali ke mode lokal', 'default');
    }
    setShowKeyModal(false);
  };

  const send = async (t) => {
    const msg = (t ?? text).trim();
    if (!msg || typing) return;
    setText('');
    const newMsgs = [...msgs, { from: 'me', text: msg }];
    setMsgs(newMsgs);
    setTyping(true);

    try {
      const replyData = await askKilaAi(msg, newMsgs, apiKey);
      setMsgs((m) => [
        ...m,
        {
          from: 'cs',
          text: replyData.text,
          action: replyData.action,
          productSuggestion: replyData.productSuggestion,
        },
      ]);
    } catch (err) {
      console.warn('AI chat error, using persona fallback:', err);
      const fallback = generateLocalPersonaReply(msg, newMsgs);
      setMsgs((m) => [
        ...m,
        {
          from: 'cs',
          text: fallback.text,
          action: fallback.action,
          productSuggestion: fallback.productSuggestion,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const isGeminiActive = apiKey.trim().startsWith('AIzaSy') && apiKey.trim().length >= 35;

  return (
    <Sheet open={open} onClose={onClose} noScroll>
      <div className="flex h-[82dvh] max-h-[82dvh] w-full flex-col overflow-hidden text-slate-800 @3xl:h-[75vh] @3xl:max-h-[620px]">
        {/* Header CS */}
        <div className="flex shrink-0 items-center gap-2.5 border-b border-slate-100 bg-navy-900 px-3.5 py-3 text-white sm:gap-3 sm:p-4">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 font-extrabold text-navy-900 shadow sm:h-10 sm:w-10">
            <Zap size={20} className="fill-navy-900" />
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-navy-900 bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="truncate text-sm font-extrabold text-white sm:text-base">Kila ⚡ (CS BC-LAT)</span>
              <span className="flex shrink-0 items-center gap-1 rounded bg-gold-400/20 px-1.5 py-0.5 text-[10px] font-bold text-gold-300">
                <Sparkles size={10} /> {isGeminiActive ? 'Gemini AI Aktif' : 'Live AI'}
              </span>
            </div>
            <div className="truncate text-[11px] text-slate-300 sm:text-xs">
              {typing ? <span className="animate-pulse font-semibold text-gold-400">Sedang mengetik…</span> : 'Online 24 Jam • Respon Kilat'}
            </div>
          </div>
          <button
            onClick={() => setShowKeyModal((v) => !v)}
            className={`shrink-0 rounded-full p-2 ${isGeminiActive ? 'bg-white/10 text-gold-400' : 'text-slate-400 hover:bg-white/10'}`}
            title="Setup Google Gemini API Key (Opsional)"
          >
            <Key size={18} />
          </button>
          <button onClick={onClose} className="shrink-0 rounded-full p-2 text-slate-300 hover:bg-white/10" aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Modal input API Key (Opsional jika ingin 100% LLM Gemini murni) */}
        {showKeyModal && (
          <div className="shrink-0 border-b border-gold-400/30 bg-navy-950 p-3 text-xs text-white animate-fade-in">
            <div className="mb-1.5 flex items-center justify-between font-bold text-gold-400">
              <span>Integrasi Google Gemini AI (Opsional)</span>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="mb-2 text-slate-300">
              Masukkan API Key Gemini dari <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-gold-300 underline">Google AI Studio (Gratis)</a> agar Kila 100% memakai model AI Gemini Flash:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-navy-900 px-3 py-1.5 font-mono text-white outline-none"
              />
              <button
                onClick={() => saveApiKey(apiKey)}
                className="shrink-0 rounded-lg bg-gold-400 px-3 py-1.5 font-extrabold text-navy-900 hover:bg-gold-500"
              >
                Simpan
              </button>
              {apiKey && (
                <button
                  onClick={() => saveApiKey('')}
                  className="shrink-0 rounded-lg bg-rose-500/20 px-2.5 py-1.5 font-bold text-rose-300 hover:bg-rose-500/40"
                  title="Hapus Kunci"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Message Area */}
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3.5 sm:p-4 thin-scrollbar">
          {msgs.map((m, i) => {
            const prod = m.productSuggestion ? getProduct(m.productSuggestion) : null;
            return (
              <div key={i} className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                    m.from === 'me'
                      ? 'rounded-br-sm bg-navy-900 text-white'
                      : 'rounded-bl-sm bg-white text-slate-800 ring-1 ring-slate-200/60'
                  }`}
                >
                  {m.text}
                </div>

                {/* Rekomendasi Produk jika ada */}
                {prod && (
                  <div className="mt-1.5 flex max-w-[88%] items-center gap-2.5 rounded-xl border border-gold-300/60 bg-amber-50/70 p-2 shadow-sm">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                      <SmartImage src={prod.image} alt={prod.name} emoji={prod.emoji} className="h-full w-full" emojiClass="text-2xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-navy-900">{prod.name}</div>
                      <div className="text-[11px] font-extrabold text-gold-600">{formatRp(prod.price)}</div>
                    </div>
                    <button
                      onClick={() => addToCart(prod.id)}
                      className="flex shrink-0 items-center gap-1 rounded-lg bg-navy-900 px-2.5 py-1.5 text-[11px] font-extrabold text-gold-400 hover:bg-navy-800 active:scale-95 transition"
                    >
                      <Plus size={13} strokeWidth={3} /> Keranjang
                    </button>
                  </div>
                )}

                {/* Tombol aksi khusus jika ada */}
                {m.action && (
                  <button
                    onClick={() => {
                      onClose();
                      go(m.action.tab);
                    }}
                    className="mt-1.5 flex items-center gap-1.5 rounded-xl bg-gold-400 px-3 py-1.5 text-xs font-bold text-navy-900 shadow-sm hover:bg-gold-500 active:scale-95 transition"
                  >
                    <span>{m.action.label}</span>
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Typing indicator bubble */}
          {typing && (
            <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200/60">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-slate-100 bg-white px-3.5 py-2.5 no-scrollbar">
          {[
            'Ada promo apa?',
            'Berapa ongkirnya?',
            'Berapa lama sampai?',
            'Laper tengah malam',
            'Ada mie goreng?',
            'Bisa bayar QRIS?',
            'Ini tugas apa?',
          ].map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-navy-900/15 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-900 hover:text-gold-400 active:scale-95 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex shrink-0 items-center gap-2 border-t border-slate-100 bg-white px-3.5 pt-2.5"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis pesan ke Kila…"
            className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3.5 py-2.5 text-base sm:text-sm outline-none focus:ring-2 focus:ring-gold-400"
          />
          <button
            type="submit"
            disabled={!text.trim() || typing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-navy-900 hover:bg-gold-500 active:scale-95 transition disabled:opacity-40"
            aria-label="Kirim"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </Sheet>
  );
}
