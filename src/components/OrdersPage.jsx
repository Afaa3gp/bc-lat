import { useState } from 'react';
import { ArrowLeft, Bike, Check, ChevronRight, ExternalLink, Globe, MapPin, MessageCircle, Navigation, Phone, Receipt, RotateCcw, Store, User, Zap } from 'lucide-react';
import { DARK_STORE_HUB, ETA_MINUTES, ORDER_STEPS, elapsedMinutes, orderStatus, useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp } from '../data/vouchers';
import { SmartImage } from './ui';

const STATUS_STYLE = {
  confirmed: 'bg-sky-100 text-sky-700',
  packing: 'bg-amber-100 text-amber-700',
  on_delivery: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-200 text-slate-600',
};

export function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLE[status.key]}`}>{status.label}</span>;
}

export default function OrdersPage() {
  const { orders, now, reorder } = useStore();
  const { trackingId, setTrackingId, go } = useUi();

  const tracking = orders.find((o) => o.id === trackingId);
  if (tracking) return <TrackingView order={tracking} onBack={() => setTrackingId(null)} />;

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center px-6 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-navy-900 text-gold-400">
          <Receipt size={44} />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-navy-900">Belum ada transaksi</h2>
        <p className="mt-1 text-sm text-slate-500">Pesanan yang kamu buat akan muncul di sini.</p>
        <button onClick={() => go('home')} className="mt-6 rounded-xl bg-gold-400 px-6 py-3 font-extrabold text-navy-900">
          Belanja Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 py-4 @3xl:py-6">
      <h1 className="px-4 text-xl font-extrabold text-navy-900 @3xl:px-0">Transaksi</h1>
      <div className="grid gap-3 px-4 @3xl:grid-cols-2 @3xl:px-0">
        {orders.map((o) => {
          const st = orderStatus(o, now);
          const active = !o.cancelled && st.key !== 'delivered';
          return (
            <div key={o.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-navy-900">{o.number}</div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(o.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} • {o.paymentMethod}
                  </div>
                </div>
                <StatusBadge status={st} />
              </div>

              {o.address && (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-xl bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600">
                  <span className="font-bold text-navy-900">📍 {o.address.label}</span>
                  <span>👤 {o.address.recipient || 'Pelanggan'}</span>
                  {o.address.phone && <span className="font-semibold text-emerald-700">📞 {o.address.phone}</span>}
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                {o.items.slice(0, 4).map((it) => (
                  <div key={it.id} className="h-12 w-12 overflow-hidden rounded-lg bg-slate-50">
                    <SmartImage src={it.image} alt={it.name} emoji={it.emoji} className="h-full w-full" emojiClass="text-2xl" />
                  </div>
                ))}
                {o.items.length > 4 && <span className="text-xs font-bold text-slate-500">+{o.items.length - 4}</span>}
                <div className="ml-auto text-right">
                  <div className="text-[11px] text-slate-500">{o.items.reduce((a, b) => a + b.qty, 0)} item</div>
                  <div className="font-extrabold text-navy-900">{formatRp(o.total)}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {active ? (
                  <button onClick={() => setTrackingId(o.id)} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-navy-900 py-2 text-sm font-bold text-gold-400">
                    <Zap size={14} className="fill-gold-400" /> Lacak Live Maps
                  </button>
                ) : (
                  <>
                    <button onClick={() => setTrackingId(o.id)} className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-bold text-navy-900">
                      Detail
                    </button>
                    <button
                      onClick={() => {
                        reorder(o);
                        go('cart');
                      }}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gold-400 py-2 text-sm font-bold text-navy-900"
                    >
                      <RotateCcw size={14} /> Beli Lagi
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackingView({ order, onBack }) {
  const { now, cancelOrder, reorder, showToast } = useStore();
  const { go } = useUi();
  const [mapMode, setMapMode] = useState('courier'); // courier | dest | satellite
  const st = orderStatus(order, now);
  const m = elapsedMinutes(order, now);
  const deliverStart = ORDER_STEPS[2].at;
  const deliverEnd = ORDER_STEPS[3].at;
  const rawProgress = (m - deliverStart) / (deliverEnd - deliverStart);
  const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
  const delivered = st.key === 'delivered';
  const remain = Math.max(0, deliverEnd - m) * 60;
  const mm = String(Math.floor(remain / 60)).padStart(2, '0');
  const ss = String(Math.floor(remain % 60)).padStart(2, '0');

  const destLat = Number(order.address?.lat) || -6.3461;
  const destLng = Number(order.address?.lng) || 106.7370;
  const totalKm = Number(order.address?.distanceKm) || 0.9;
  const remainKm = delivered ? '0.00' : Math.max(0.05, totalKm * (1 - clampedProgress)).toFixed(2);
  const speedKmh = delivered || order.cancelled || st.index < 2 ? 0 : 34 + Math.round(Math.sin(now / 1000) * 4);
  const curLat = (DARK_STORE_HUB.lat + (destLat - DARK_STORE_HUB.lat) * clampedProgress).toFixed(4);
  const curLng = (DARK_STORE_HUB.lng + (destLng - DARK_STORE_HUB.lng) * clampedProgress).toFixed(4);

  // Pin yang ditampilkan di Google Maps (di-bucket per 20% agar iframe tidak berkedip tiap detik)
  const bucketProgress = Math.round(clampedProgress * 5) / 5;
  const mapLat = mapMode === 'courier'
    ? (DARK_STORE_HUB.lat + (destLat - DARK_STORE_HUB.lat) * bucketProgress).toFixed(4)
    : destLat;
  const mapLng = mapMode === 'courier'
    ? (DARK_STORE_HUB.lng + (destLng - DARK_STORE_HUB.lng) * bucketProgress).toFixed(4)
    : destLng;
  const mapType = mapMode === 'satellite' ? 'k' : 'm';

  const gmapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${DARK_STORE_HUB.lat},${DARK_STORE_HUB.lng}&destination=${destLat},${destLng}&travelmode=two-wheeler`;

  return (
    <div className="py-4 @3xl:py-6">
      <div className="mb-3 flex items-center gap-2 px-4 @3xl:px-0">
        <button onClick={onBack} className="rounded-full p-1.5 hover:bg-slate-200" aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-navy-900">Lacak Pesanan</h1>
          <div className="text-xs text-slate-500">{order.number}</div>
        </div>
        <StatusBadge status={st} />
      </div>

      <div className="@3xl:grid @3xl:grid-cols-[1.3fr_1fr] @3xl:gap-5">
        <div className="space-y-3">
          {/* ETA */}
          <div className="mx-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-navy-900 to-navy-700 p-4 text-white @3xl:mx-0">
            <div>
              <div className="text-xs text-slate-300">{order.cancelled ? 'Pesanan dibatalkan' : delivered ? 'Pesanan sudah tiba' : 'Estimasi tiba dalam'}</div>
              <div className="text-3xl font-extrabold tabular-nums">
                {order.cancelled ? '—' : delivered ? `${Math.min(ETA_MINUTES, Math.ceil(deliverEnd))} menit ✓` : `${mm}:${ss}`}
              </div>
            </div>
            <div className="text-right text-xs text-slate-300">
              Garansi
              <div className="flex items-center gap-1 text-lg font-extrabold text-gold-400">
                <Zap size={18} className="fill-gold-400" /> 15 Menit
              </div>
            </div>
          </div>

          {/* Google Maps Asli + Live Telemetry */}
          <div className="mx-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 @3xl:mx-0">
            {/* Toolbar Peta Google Maps */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex rounded-xl bg-slate-200/80 p-0.5 text-[11px] font-bold">
                <button
                  onClick={() => setMapMode('courier')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${mapMode === 'courier' ? 'bg-navy-900 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-navy-900'}`}
                >
                  <Navigation size={11} /> Posisi Kurir
                </button>
                <button
                  onClick={() => setMapMode('dest')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${mapMode === 'dest' ? 'bg-navy-900 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-navy-900'}`}
                >
                  <MapPin size={11} /> Titik Tujuan
                </button>
                <button
                  onClick={() => setMapMode('satellite')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${mapMode === 'satellite' ? 'bg-navy-900 text-gold-400 shadow-sm' : 'text-slate-600 hover:text-navy-900'}`}
                >
                  <Globe size={11} /> Satelit
                </button>
              </div>
              <a
                href={gmapsRouteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
              >
                <span>Rute Google Maps</span>
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Iframe Google Maps Asli */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-100">
              <iframe
                key={`${mapLat}-${mapLng}-${mapType}`}
                title="Google Maps Pelacakan Kurir BC-LAT"
                src={`https://maps.google.com/maps?q=${mapLat},${mapLng}&hl=id&z=16&t=${mapType}&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Live Route Badge di atas Google Maps */}
              <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 rounded-xl bg-navy-900/95 p-2.5 text-white shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="truncate text-slate-200">🏪 Hub Pamulang</span>
                  <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-extrabold text-navy-900">
                    {order.cancelled ? 'Dibatalkan' : delivered ? 'Tiba di Tujuan ✓' : st.index < 2 ? 'Menyiapkan di Hub' : `🛵 Kurir Melaju (${Math.round(clampedProgress * 100)}%)`}
                  </span>
                  <span className="truncate text-gold-300">📍 {order.address?.label}</span>
                </div>
                <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 transition-all duration-700"
                    style={{ width: `${order.cancelled ? 0 : st.index < 2 ? 12 : Math.max(15, Math.round(clampedProgress * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bar Telemetri GPS Kurir */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-white px-2 py-2 text-center text-[11px]">
              <div>
                <div className="text-[10px] text-slate-400">Jarak Sisa</div>
                <div className="font-extrabold text-navy-900">{remainKm} km</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Kecepatan Kurir</div>
                <div className="font-extrabold text-emerald-600">{speedKmh} km/jam</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">GPS Live</div>
                <div className="truncate font-mono text-[10px] font-bold text-slate-700">{curLat}, {curLng}</div>
              </div>
            </div>
          </div>

          {/* Kurir */}
          <div className="mx-4 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70 @3xl:mx-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400 text-navy-900">
              <Bike size={22} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-navy-900">{order.courier.name}</div>
              <div className="text-xs text-slate-500">
                {order.courier.vehicle} • {order.courier.plate}
              </div>
            </div>
            <button
              onClick={() => showToast(`Kurir ${order.courier.name}: "Siap kak ${order.address?.recipient || ''}, pesanan segera tiba di ${order.address.label}!"`, 'success')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-navy-800 hover:bg-slate-200 active:scale-95 transition"
              aria-label="Chat kurir"
              title="Chat Kurir"
            >
              <MessageCircle size={18} />
            </button>
            <button
              onClick={() => showToast(`Menghubungi ${order.courier.name} (${order.courier.plate})... "Halo kak, kurir sudah dekat!"`, 'default')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-navy-800 hover:bg-slate-200 active:scale-95 transition"
              aria-label="Telepon kurir"
              title="Telepon Kurir"
            >
              <Phone size={18} />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-3 @3xl:mt-0">
          {/* Timeline */}
          <div className="mx-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 @3xl:mx-0">
            <div className="mb-3 text-sm font-extrabold text-navy-900">Status Pesanan</div>
            {ORDER_STEPS.map((s, i) => {
              const done = !order.cancelled && st.index >= i;
              const current = !order.cancelled && st.index === i && !delivered;
              const Icon = [Check, Store, Bike, MapPin][i];
              return (
                <div key={s.key} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < ORDER_STEPS.length - 1 && <div className={`absolute top-8 left-[15px] h-[calc(100%-24px)] w-0.5 ${st.index > i && !order.cancelled ? 'bg-gold-400' : 'bg-slate-200'}`} />}
                  <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? 'bg-navy-900 text-gold-400' : 'bg-slate-100 text-slate-400'} ${current ? 'ring-4 ring-gold-300' : ''}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${done ? 'text-navy-900' : 'text-slate-400'}`}>{s.label}</div>
                    <div className="text-xs text-slate-500">{s.desc}</div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {new Date(order.createdAt + (s.at * 60000) / order.speed).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rincian Penerima, Nomor Telepon & Pesanan */}
          <div className="mx-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 @3xl:mx-0">
            <div className="mb-2 text-sm font-extrabold text-navy-900">Rincian Pengiriman & Pesanan</div>
            <div className="mb-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1 font-extrabold text-navy-900">
                  <User size={13} className="text-gold-600" /> {order.address?.recipient || 'Pelanggan BC-LAT'}
                </span>
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Phone size={12} /> {order.address?.phone || '0812-3456-7890'}
                </span>
              </div>
              <div className="flex gap-1.5 text-slate-600">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold-600" />
                <span>
                  <b className="text-navy-900">{order.address?.label}:</b> {order.address?.full}
                </span>
              </div>
              {order.address?.notes && (
                <div className="text-[11px] text-slate-500">Catatan kurir: {order.address.notes}</div>
              )}
            </div>
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between py-0.5 text-sm">
                <span className="text-slate-600">
                  {it.qty}x {it.name}
                </span>
                <span className="font-semibold">{formatRp(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="my-2 border-t border-dashed border-slate-200" />
            <div className="flex justify-between text-sm text-slate-600"><span>Ongkir</span><span>{order.deliveryFee ? formatRp(order.deliveryFee) : 'GRATIS'}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Voucher {order.voucherCode}</span><span>-{formatRp(order.discount)}</span></div>}
            <div className="mt-1 flex justify-between font-extrabold text-navy-900"><span>Total ({order.paymentMethod})</span><span>{formatRp(order.total)}</span></div>
          </div>

          <div className="flex gap-2 px-4 @3xl:px-0">
            {st.index < 2 && !order.cancelled && (
              <button onClick={() => cancelOrder(order.id)} className="flex-1 rounded-xl border border-rose-200 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50">
                Batalkan Pesanan
              </button>
            )}
            {(delivered || order.cancelled) && (
              <button
                onClick={() => {
                  reorder(order);
                  go('cart');
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-gold-400 py-2.5 text-sm font-bold text-navy-900"
              >
                <RotateCcw size={14} /> Beli Lagi <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
