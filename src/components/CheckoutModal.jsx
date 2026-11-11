import { useMemo, useState } from 'react';
import { ArrowLeft, Banknote, Building2, CheckCircle2, Copy, Loader2, MapPin, Phone, QrCode, Smartphone, User, X, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp } from '../data/vouchers';
import { Sheet } from './ui';

const METHODS = [
  { id: 'QRIS', label: 'QRIS', desc: 'Scan pakai semua e-wallet & m-banking', icon: QrCode, badge: 'Rekomendasi' },
  { id: 'GOPAY', label: 'GoPay', desc: 'Saldo GoPay', icon: Smartphone },
  { id: 'SHOPEEPAY', label: 'ShopeePay', desc: 'Saldo ShopeePay', icon: Smartphone },
  { id: 'VA', label: 'Virtual Account BCA', desc: 'Transfer via m-BCA / ATM', icon: Building2 },
  { id: 'COD', label: 'Bayar di Tempat (COD)', desc: 'Bayar tunai ke kurir', icon: Banknote },
];

export default function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen, setTrackingId, go } = useUi();
  const { total, placeOrder, cartCount, showToast, address, updateActiveAddressField } = useStore();
  const [method, setMethod] = useState('QRIS');
  const [step, setStep] = useState('method'); // method | pay | processing | success
  const [order, setOrder] = useState(null);

  const close = () => {
    setCheckoutOpen(false);
    setTimeout(() => setStep('method'), 300);
  };

  const confirm = () => {
    setStep('processing');
    setTimeout(() => {
      const o = placeOrder(method);
      setOrder(o);
      setStep('success');
    }, 1600);
  };

  const proceed = () => (method === 'COD' ? confirm() : setStep('pay'));

  if (!checkoutOpen) return null;

  return (
    <Sheet open onClose={step === 'processing' ? undefined : close}>
      <div className="p-5">
        {step === 'method' && (
          <>
            <Head title="Pilih Metode Pembayaran" onClose={close} />

            {/* Ringkasan Penerima & Nomor Telepon */}
            <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-xs">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1 font-extrabold text-navy-900">
                  <MapPin size={13} className="text-gold-600" /> Dikirim ke: {address?.label}
                </span>
                <span className="rounded bg-navy-900 px-1.5 py-0.5 text-[10px] font-bold text-gold-400">
                  ⚡ 15 Menit
                </span>
              </div>
              <div className="mb-2 line-clamp-1 text-[11px] text-slate-600">{address?.full}</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 ring-1 ring-slate-200">
                  <User size={13} className="shrink-0 text-slate-400" />
                  <input
                    type="text"
                    value={address?.recipient || ''}
                    onChange={(e) => updateActiveAddressField({ recipient: e.target.value })}
                    placeholder="Nama Penerima"
                    className="w-full bg-transparent text-xs font-bold text-navy-900 outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 ring-1 ring-slate-200">
                  <Phone size={13} className="shrink-0 text-emerald-600" />
                  <input
                    type="tel"
                    value={address?.phone || ''}
                    onChange={(e) => updateActiveAddressField({ phone: e.target.value })}
                    placeholder="No. Telepon / WA"
                    className="w-full bg-transparent text-xs font-bold text-navy-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {METHODS.map(({ id, label, desc, icon: Icon, badge }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${method === id ? 'border-gold-500 bg-gold-300/15' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${method === id ? 'bg-navy-900 text-gold-400' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-navy-900">
                      {label}
                      {badge && <span className="rounded bg-emerald-100 px-1.5 text-[10px] text-emerald-700">{badge}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                  <span className={`h-5 w-5 rounded-full border-2 ${method === id ? 'border-[6px] border-navy-900' : 'border-slate-300'}`} />
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div>
                <div className="text-xs text-slate-500">Total bayar ({cartCount} item)</div>
                <div className="text-xl font-extrabold text-navy-900">{formatRp(total)}</div>
              </div>
              <button onClick={proceed} className="rounded-xl bg-gold-400 px-6 py-3 font-extrabold text-navy-900 hover:bg-gold-500">
                {method === 'COD' ? 'Pesan Sekarang' : 'Bayar'}
              </button>
            </div>
          </>
        )}

        {step === 'pay' && (
          <>
            <Head title={METHODS.find((m) => m.id === method).label} onBack={() => setStep('method')} onClose={close} />
            {method === 'QRIS' && (
              <div className="flex flex-col items-center text-center">
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200">
                  <img
                    src="/images/qris.jpg"
                    alt="QRIS BC-LAT"
                    className="block max-h-[38vh] w-auto mx-auto object-contain sm:max-h-[48vh]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden p-4">
                    <FakeQR seed={total} />
                  </div>
                </div>
                <div className="mt-3 text-xs sm:text-sm text-slate-500">Scan QR dengan aplikasi e-wallet atau m-banking</div>
                <div className="text-xl sm:text-2xl font-extrabold text-navy-900">{formatRp(total)}</div>
                <div className="mt-2 rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
                  Mode demo: cukup tekan tombol di bawah, tidak perlu scan & bayar sungguhan.
                </div>
              </div>
            )}
            {(method === 'GOPAY' || method === 'SHOPEEPAY') && (
              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <Smartphone className="mx-auto text-navy-700" size={40} />
                <div className="mt-3 text-sm text-slate-600">Kamu akan diarahkan ke aplikasi {method === 'GOPAY' ? 'Gojek' : 'Shopee'} untuk konfirmasi pembayaran sebesar</div>
                <div className="mt-1 text-2xl font-extrabold text-navy-900">{formatRp(total)}</div>
              </div>
            )}
            {method === 'VA' && (
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-xs text-slate-500">Nomor Virtual Account BCA</div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <span className="font-mono text-lg sm:text-xl font-extrabold tracking-wider text-navy-900">8077 0812 3456 7890</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('8077081234567890');
                      showToast('Nomor VA BCA disalin!', 'success');
                    }}
                    className="flex items-center gap-1 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-bold text-gold-400 hover:bg-navy-800 active:scale-95 transition"
                  >
                    <Copy size={14} /> Salin
                  </button>
                </div>
                <div className="mt-4 text-xs text-slate-500">Jumlah transfer</div>
                <div className="text-xl font-extrabold text-navy-900">{formatRp(total)}</div>
              </div>
            )}
            <button onClick={confirm} className="mt-5 h-12 w-full rounded-xl bg-navy-900 font-extrabold text-gold-400 hover:bg-navy-800">
              Saya Sudah Bayar (Simulasi)
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center py-14 text-center">
            <Loader2 className="animate-spin text-gold-500" size={48} />
            <div className="mt-4 font-extrabold text-navy-900">Memverifikasi pembayaran…</div>
            <div className="text-sm text-slate-500">Mohon tunggu sebentar</div>
          </div>
        )}

        {step === 'success' && order && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={48} />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-navy-900">Pesanan Berhasil!</h3>
            <div className="mt-1 text-sm text-slate-500">
              No. pesanan <b className="text-navy-900">{order.number}</b>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-navy-900 px-4 py-3 text-sm font-bold text-white">
              <Zap size={18} className="fill-gold-400 text-gold-400" /> Estimasi tiba dalam 15 menit
            </div>
            <button
              onClick={() => {
                close();
                go('orders');
                setTrackingId(order.id);
              }}
              className="mt-6 h-12 w-full rounded-xl bg-gold-400 font-extrabold text-navy-900 hover:bg-gold-500"
            >
              Lacak Pesanan
            </button>
          </div>
        )}
      </div>
    </Sheet>
  );
}

function Head({ title, onBack, onClose }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {onBack && (
        <button onClick={onBack} className="rounded-full p-1 hover:bg-slate-100" aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
      )}
      <h3 className="flex-1 text-lg font-extrabold text-navy-900">{title}</h3>
      <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100" aria-label="Tutup">
        <X size={20} />
      </button>
    </div>
  );
}

/** QR code dekoratif (simulasi) — pola deterministik dengan finder pattern */
function FakeQR({ seed = 1 }) {
  const N = 25;
  const cells = useMemo(() => {
    let x = (seed % 9973) + 7;
    const rnd = () => ((x = (x * 16807) % 2147483647) / 2147483647);
    const out = [];
    const inFinder = (r, c) => [[0, 0], [0, N - 7], [N - 7, 0]].some(([fr, fc]) => r >= fr - 1 && r <= fr + 7 && c >= fc - 1 && c <= fc + 7);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!inFinder(r, c) && rnd() > 0.52) out.push([r, c]);
    return out;
  }, [seed]);
  const finder = (r, c) => (
    <g key={`${r}-${c}`}>
      <rect x={c} y={r} width={7} height={7} fill="#0B132B" />
      <rect x={c + 1} y={r + 1} width={5} height={5} fill="#fff" />
      <rect x={c + 2} y={r + 2} width={3} height={3} fill="#0B132B" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="h-48 w-48" shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={N + 2} height={N + 2} fill="#fff" />
      {cells.map(([r, c]) => (
        <rect key={`${r}.${c}`} x={c} y={r} width={1} height={1} fill="#0B132B" />
      ))}
      {finder(0, 0)}
      {finder(0, N - 7)}
      {finder(N - 7, 0)}
      <rect x={N / 2 - 2.5} y={N / 2 - 2.5} width={5} height={5} rx={1} fill="#F59E0B" />
      <text x={N / 2} y={N / 2 + 1.4} textAnchor="middle" fontSize="4" fontWeight="900" fill="#0B132B">⚡</text>
    </svg>
  );
}
