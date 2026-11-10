import { useState } from 'react';
import { ChevronDown, Headphones, Home, MapPin, Receipt, Search, Send, ShoppingCart, User, X, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { Logo, Sheet } from './ui';

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
            ⚡ Semua alamat berada dalam radius 3 km dari <b>Dark Store BC-LAT Kaliurang</b> — pengantaran 15 menit dijamin.
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

const CS_REPLIES = [
  [/ongkir|gratis/i, 'Ongkir flat Rp5.000 ya kak. Pakai kode FREEONGKIR untuk gratis ongkir (min. belanja Rp30.000) 🛵'],
  [/lama|berapa menit|kapan|sampai/i, 'Pesanan dikemas maks. 3 menit dan diantar kurir dari Dark Store terdekat. Rata-rata tiba di bawah 15 menit ⚡'],
  [/voucher|promo|diskon/i, 'Promo aktif: BCLATHEMAT (diskon 20%), KILAT15 (potongan Rp15.000), FREEONGKIR. Masukkan di halaman keranjang ya!'],
  [/bayar|qris|cod/i, 'Bisa bayar pakai QRIS, GoPay, ShopeePay, Virtual Account, atau COD kak.'],
];

function ChatCS({ open, onClose }) {
  const [msgs, setMsgs] = useState([{ from: 'cs', text: 'Halo kak! Saya Kila dari BC-LAT ⚡ Ada yang bisa dibantu?' }]);
  const [text, setText] = useState('');

  const send = (t) => {
    const msg = (t ?? text).trim();
    if (!msg) return;
    setText('');
    setMsgs((m) => [...m, { from: 'me', text: msg }]);
    const reply = CS_REPLIES.find(([re]) => re.test(msg))?.[1] || 'Siap kak, pesanmu sudah kami catat. Tim CS akan segera membantu 🙏';
    setTimeout(() => setMsgs((m) => [...m, { from: 'cs', text: reply }]), 700);
  };

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex h-[70vh] max-h-[560px] flex-col text-slate-800">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-gold-400">
            <Headphones size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-navy-900">CS BC-LAT</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online 24 jam
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4 thin-scrollbar">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === 'me' ? 'rounded-br-sm bg-navy-900 text-white' : 'rounded-bl-sm bg-white shadow-sm'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pt-3 no-scrollbar">
          {['Berapa ongkirnya?', 'Ada promo apa?', 'Berapa lama sampai?', 'Bisa bayar QRIS?'].map((q) => (
            <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-navy-900/15 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-slate-100">
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2 p-4"
        >
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan…" className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold-400" />
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400 text-navy-900 hover:bg-gold-500" aria-label="Kirim">
            <Send size={18} />
          </button>
        </form>
      </div>
    </Sheet>
  );
}
