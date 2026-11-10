import { useEffect, useState } from 'react';
import { CheckCircle2, Monitor, RotateCcw, Smartphone, Store, User, X, XCircle, Zap } from 'lucide-react';
import { useStore } from './context/StoreContext';
import { UiProvider, useUi } from './context/UiContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/BottomNav';
import ProductSheet from './components/ProductSheet';
import CheckoutModal from './components/CheckoutModal';
import { Logo } from './components/ui';

export default function App() {
  return (
    <UiProvider>
      <Root />
    </UiProvider>
  );
}

function Root() {
  const [view, setView] = useState(() => localStorage.getItem('bclat-view') || 'desktop');
  const [wide, setWide] = useState(() => window.innerWidth >= 900);

  useEffect(() => localStorage.setItem('bclat-view', view), [view]);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const phone = view === 'mobile' && wide;

  return (
    <div className="flex h-full flex-col">
      <PresenterBar view={view} setView={setView} />
      {phone ? (
        <div className="relative flex min-h-0 flex-1 items-center justify-center gap-12 overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700 p-6">
          <BrandPanel />
          <div
            className="relative h-full max-h-[860px] w-[400px] shrink-0 overflow-hidden rounded-[2.75rem] border-[10px] border-black bg-slate-100 shadow-2xl shadow-black/50 ring-2 ring-white/10"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="absolute top-2 left-1/2 z-[60] h-6 w-28 -translate-x-1/2 rounded-full bg-black" />
            <div data-scroll-root className="@container h-full overflow-y-auto no-scrollbar pt-6">
              <AppShell />
            </div>
          </div>
        </div>
      ) : (
        <div data-scroll-root className="@container min-h-0 flex-1 overflow-y-auto">
          <AppShell />
        </div>
      )}
    </div>
  );
}

function AppShell() {
  const { tab } = useUi();
  const Page = { home: HomePage, cart: CartPage, orders: OrdersPage, profile: ProfilePage, admin: AdminDashboard }[tab];
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 pb-28 @3xl:px-6 @3xl:pb-12">
        <Page />
      </main>
      <Footer />
      <InstallBanner />
      <BottomNav />
      <ProductSheet />
      <CheckoutModal />
      <Toast />
    </div>
  );
}

function PresenterBar({ view, setView }) {
  const { tab, go } = useUi();
  const { demoSpeed, setDemoSpeed, resetDemo } = useStore();
  const isAdmin = tab === 'admin';

  return (
    <div className="z-[70] hidden shrink-0 items-center gap-3 bg-navy-950 px-4 py-2 text-xs text-slate-300 md:flex">
      <span className="flex items-center gap-1.5 font-bold text-gold-400">
        <Zap size={14} className="fill-gold-400" /> Presenter
      </span>
      <Seg
        value={view}
        onChange={setView}
        options={[
          ['desktop', <Monitor size={14} />, 'Desktop'],
          ['mobile', <Smartphone size={14} />, 'Tampilan HP'],
        ]}
      />
      <Seg
        value={isAdmin ? 'admin' : 'buyer'}
        onChange={(v) => go(v === 'admin' ? 'admin' : 'home')}
        options={[
          ['buyer', <User size={14} />, 'Pembeli'],
          ['admin', <Store size={14} />, 'Admin Toko'],
        ]}
      />
      <label className="flex items-center gap-2">
        Simulasi waktu
        <select value={demoSpeed} onChange={(e) => setDemoSpeed(Number(e.target.value))} className="rounded-md bg-navy-800 px-2 py-1 font-semibold text-white outline-none">
          <option value={1}>Real (15 menit)</option>
          <option value={15}>Demo (±1 menit)</option>
          <option value={60}>Kilat (±15 detik)</option>
        </select>
      </label>
      <button
        onClick={() => {
          if (confirm('Reset semua data demo (keranjang & transaksi)?')) {
            resetDemo();
            go('home');
          }
        }}
        className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 font-semibold hover:bg-white/10"
      >
        <RotateCcw size={14} /> Reset Demo
      </button>
    </div>
  );
}

function Seg({ value, onChange, options }) {
  return (
    <div className="flex rounded-lg bg-navy-800 p-0.5">
      {options.map(([v, icon, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold ${value === v ? 'bg-gold-400 text-navy-900' : 'hover:text-white'}`}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="hidden max-w-sm text-white lg:block">
      <img src="/images/logo.jpg" alt="Logo BC-LAT" className="w-full rounded-3xl shadow-2xl ring-1 ring-white/10" />
      <h2 className="mt-8 text-3xl leading-tight font-extrabold">
        Keperluan sehari-hari, <span className="text-gold-gradient">tiba dalam 15 menit.</span>
      </h2>
      <p className="mt-3 text-sm text-slate-300">
        Quick-commerce berbasis Dark Store: pesan dari aplikasi, dikemas dalam 3 menit, diantar kurir kilat. Buka 24 jam.
      </p>
      <div className="mt-6 flex gap-3 text-xs">
        {['⚡ 15 menit', '🕐 24 jam', '🏷️ Harga hemat'].map((t) => (
          <span key={t} className="rounded-full bg-white/10 px-3 py-1.5 font-semibold ring-1 ring-white/10">{t}</span>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="hidden bg-navy-950 text-slate-400 @3xl:block">
      <div className="mx-auto grid max-w-6xl grid-cols-4 gap-8 px-6 py-10 text-sm">
        <div className="col-span-2">
          <Logo size="md" tagline />
          <p className="mt-4 max-w-sm">Market online untuk keperluan sehari-hari. Belanja kebutuhan dapur, snack, dan rumah tangga — tiba dalam 15 menit, buka 24 jam.</p>
        </div>
        <div>
          <div className="mb-3 font-bold text-white">Layanan</div>
          <ul className="space-y-1.5">
            <li>Pengantaran 15 menit</li>
            <li>Kombo Hemat</li>
            <li>Voucher & Promo</li>
            <li>CS 24 jam</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-bold text-white">Pembayaran</div>
          <div className="flex flex-wrap gap-1.5">
            {['QRIS', 'GoPay', 'ShopeePay', 'BCA VA', 'COD'].map((m) => (
              <span key={m} className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-slate-200">{m}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© 2026 BC-LAT Market Online • Website demo tugas mata kuliah Bisnis</div>
    </footer>
  );
}

/** Banner promo ala "Install aplikasi" di Astro */
function InstallBanner() {
  const { tab } = useUi();
  const { applyVoucher, showToast } = useStore();
  const [hidden, setHidden] = useState(false);
  if (hidden || tab !== 'home') return null;

  const handleInstall = () => {
    applyVoucher('FREEONGKIR');
    showToast('🎁 Voucher FREEONGKIR berhasil diklaim & masuk keranjang!', 'success');
    setHidden(true);
  };

  return (
    <div className="fixed inset-x-2 bottom-[74px] z-30 flex items-center gap-3 rounded-2xl bg-sky-50 p-3 shadow-xl ring-1 ring-sky-200 @3xl:inset-x-auto @3xl:right-6 @3xl:bottom-6 @3xl:w-96 animate-pop">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 shadow">
        <Zap size={22} className="fill-gold-400 text-gold-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-slate-600 font-medium">Dapatkan promo spesial</div>
        <div className="text-sm leading-tight font-extrabold text-navy-900">Voucher & Gratis Ongkir</div>
        <div className="text-[10px] text-slate-500">Klaim voucher instan di sini!</div>
      </div>
      <button
        onClick={handleInstall}
        className="rounded-xl bg-navy-900 px-3 py-2 text-xs font-bold text-gold-400 hover:bg-navy-800 active:scale-95 transition"
      >
        Klaim
      </button>
      <button onClick={() => setHidden(true)} className="absolute -top-2 -right-1 rounded-full bg-white p-1 text-slate-500 shadow hover:bg-slate-100" aria-label="Tutup">
        <X size={14} />
      </button>
    </div>
  );
}

function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const Icon = toast.tone === 'error' ? XCircle : CheckCircle2;
  return (
    <div key={toast.id} className="animate-pop pointer-events-none fixed inset-x-0 top-24 z-[80] flex justify-center px-4">
      <div className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-xl ${toast.tone === 'error' ? 'bg-rose-600' : 'bg-navy-900'}`}>
        <Icon size={18} className={toast.tone === 'error' ? '' : 'text-gold-400'} />
        {toast.message}
      </div>
    </div>
  );
}
