import { useState } from 'react';
import { Check, Compass, Edit3, ExternalLink, Loader2, MapPin, Navigation, Phone, Plus, Search, Trash2, User, X } from 'lucide-react';
import { calcHubDistanceKm, useStore } from '../context/StoreContext';
import { Sheet } from './ui';

const QUICK_PINS = [
  {
    label: 'Kampus UNPAM Pusat',
    lat: -6.3461,
    lng: 106.7370,
    full: 'Universitas Pamulang (UNPAM), Jl. Surya Kencana No. 1, Pamulang, Tangerang Selatan',
  },
  {
    label: 'UNPAM Kampus 2 (Viktor)',
    lat: -6.3478,
    lng: 106.6915,
    full: 'Universitas Pamulang Kampus 2 (Viktor), Jl. Raya Puspiptek, Serpong, Tangerang Selatan',
  },
  {
    label: 'Alun-Alun Pamulang',
    lat: -6.3435,
    lng: 106.7368,
    full: 'Alun-Alun Kecamatan Pamulang, Jl. Siliwangi, Pamulang Barat, Tangerang Selatan',
  },
  {
    label: 'Villa Dago Pamulang',
    lat: -6.3352,
    lng: 106.7224,
    full: 'Perumahan Villa Dago Pamulang, Benda Baru, Pamulang, Tangerang Selatan',
  },
  {
    label: 'Simpang Gaplek',
    lat: -6.3446,
    lng: 106.7582,
    full: 'Jl. Raya Ciputat - Parung (Simpang Gaplek), Pondok Cabe, Pamulang, Tangerang Selatan',
  },
];

export default function AddressModal({ open, onClose, initialEdit = false }) {
  const { address, addresses, userProfile, setAddressId, saveAddress, deleteAddress, showToast } = useStore();
  const [editing, setEditing] = useState(initialEdit ? address : null);
  const [mapType, setMapType] = useState('m'); // 'm' = Peta Jalan, 'k' = Satelit
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [form, setForm] = useState({
    id: '',
    label: 'Kost / Rumah',
    recipient: userProfile?.name || 'Kelompok BC-LAT',
    phone: userProfile?.phone || '0812-3456-7890',
    full: '',
    notes: '',
    lat: -6.3461,
    lng: 106.7370,
  });

  const openEdit = (addr) => {
    const target = addr || {
      id: '',
      label: 'Lokasi Baru',
      recipient: address?.recipient || userProfile?.name || 'Kelompok BC-LAT',
      phone: address?.phone || userProfile?.phone || '0812-3456-7890',
      full: '',
      notes: '',
      lat: address?.lat || -6.3461,
      lng: address?.lng || 106.7370,
    };
    setForm({
      id: target.id || '',
      label: target.label || 'Lokasi Baru',
      recipient: target.recipient || userProfile?.name || '',
      phone: target.phone || userProfile?.phone || '',
      full: target.full || '',
      notes: target.notes || '',
      lat: Number(target.lat) || -6.3461,
      lng: Number(target.lng) || 106.7370,
    });
    setSearchResults([]);
    setEditing(target);
  };

  const detectGps = () => {
    if (!navigator.geolocation) {
      showToast('Browser tidak mendukung GPS otomatis', 'error');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        let detectedAddress = `Titik GPS (${lat}, ${lng}), Tangerang Selatan`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=id`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) detectedAddress = data.display_name;
          }
        } catch {
          /* gunakan koordinat jika offline */
        }
        setGpsLoading(false);
        const nextForm = {
          id: editing?.id || '',
          label: editing?.label && editing.label !== 'Lokasi Baru' ? editing.label : 'Lokasi GPS Saya',
          recipient: form.recipient || address?.recipient || userProfile?.name || 'Pelanggan BC-LAT',
          phone: form.phone || address?.phone || userProfile?.phone || '0812-3456-7890',
          full: detectedAddress,
          notes: form.notes || 'Titik sesuai GPS perangkat',
          lat,
          lng,
        };
        setForm(nextForm);
        setEditing(nextForm);
        showToast('Titik GPS berhasil ditemukan! Silakan cek detail & simpan.', 'success');
      },
      () => {
        setGpsLoading(false);
        showToast('Izin lokasi ditolak / GPS tidak aktif. Gunakan pencarian peta di bawah.', 'error');
        if (!editing) openEdit(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSearchMap = async (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&countrycodes=id&limit=4&accept-language=id`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data || []);
        if (data?.[0]) {
          const first = data[0];
          setForm((f) => ({
            ...f,
            lat: Number(Number(first.lat).toFixed(5)),
            lng: Number(Number(first.lon).toFixed(5)),
            full: f.full || first.display_name,
          }));
        }
      }
    } catch {
      showToast('Gagal mencari lokasi, silakan pilih pin cepat', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.recipient.trim()) {
      showToast('Nama penerima wajib diisi', 'error');
      return;
    }
    if (!form.phone.trim() || form.phone.trim().length < 8) {
      showToast('Nomor telepon / WhatsApp aktif wajib diisi', 'error');
      return;
    }
    if (!form.full.trim()) {
      showToast('Alamat lengkap wajib diisi', 'error');
      return;
    }
    saveAddress(form);
    setEditing(null);
    onClose?.();
  };

  const activeLat = editing ? form.lat : address?.lat || -6.3461;
  const activeLng = editing ? form.lng : address?.lng || 106.7370;
  const activeDist = calcHubDistanceKm(activeLat, activeLng);

  return (
    <Sheet
      open={open}
      onClose={() => {
        setEditing(null);
        onClose?.();
      }}
    >
      <div className="p-4 sm:p-5 text-slate-800">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-navy-900">
              {editing ? (form.id ? 'Ubah Lokasi & Nomor Telepon' : 'Tambah Lokasi & Nomor Telepon') : 'Lokasi Pengiriman & Peta'}
            </h3>
            <p className="text-xs text-slate-500">
              {editing
                ? 'Isi nomor WhatsApp/telepon aktif & titik Google Maps pengiriman'
                : 'Pilih titik pengantaran 15 menit atau tambah lokasi baru'}
            </p>
          </div>
          <button
            onClick={() => {
              if (editing) setEditing(null);
              else onClose?.();
            }}
            className="rounded-full p-1.5 hover:bg-slate-100"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Google Maps Asli (Interactive Iframe) */}
        <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-navy-900">
              <MapPin size={13} className="text-rose-500" />
              <span>Google Maps Live Pin</span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                {activeDist} km dari Hub
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMapType((t) => (t === 'm' ? 'k' : 'm'))}
                className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-navy-800 hover:bg-slate-200"
              >
                {mapType === 'm' ? '🛰️ Satelit' : '🗺️ Peta Jalan'}
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 rounded-lg bg-navy-900 px-2 py-0.5 text-[10px] font-bold text-gold-400"
              >
                <span>Buka Maps</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <iframe
            key={`${activeLat}-${activeLng}-${mapType}`}
            title="Google Maps Lokasi Pengiriman BC-LAT"
            src={`https://maps.google.com/maps?q=${activeLat},${activeLng}&hl=id&z=16&t=${mapType}&output=embed`}
            className="h-44 sm:h-52 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 bg-navy-900 px-3 py-2 text-[11px] text-white">
            <span className="truncate font-mono text-[10px] text-slate-300">
              📌 Koordinat: {activeLat}, {activeLng} • Estimasi ~{Math.max(5, Math.min(15, Math.round(activeDist * 5)))} menit
            </span>
            <button
              type="button"
              onClick={detectGps}
              disabled={gpsLoading}
              className="flex items-center gap-1 rounded-lg bg-gold-400 px-2.5 py-1 text-[11px] font-extrabold text-navy-900 hover:bg-gold-300 active:scale-95 transition disabled:opacity-60"
            >
              {gpsLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
              <span>{gpsLoading ? 'Mendeteksi GPS…' : 'Gunakan GPS Saya'}</span>
            </button>
          </div>
        </div>

        {editing ? (
          /* FORM INPUT ALAMAT, NOMOR TELEPON, & PENCARIAN PETA */
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Pencarian Lokasi Google Maps / OSM */}
            <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
              <label className="mb-1.5 block text-[11px] font-extrabold text-navy-900">
                🔍 Cari Titik Peta / Nama Jalan / Kampus
              </label>
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchMap(e);
                      }
                    }}
                    placeholder="Ketik mis. UNPAM, Pamulang, Ciputat, BSD..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-8 text-xs outline-none focus:border-navy-900"
                  />
                  <Search size={14} className="absolute top-2.5 left-2.5 text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={handleSearchMap}
                  disabled={searching}
                  className="rounded-xl bg-navy-900 px-3 py-2 text-xs font-bold text-gold-400 hover:bg-navy-800"
                >
                  {searching ? '...' : 'Cari Peta'}
                </button>
              </div>

              {/* Hasil pencarian lokasi */}
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-28 space-y-1 overflow-y-auto rounded-xl bg-white p-1.5 ring-1 ring-slate-200">
                  {searchResults.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          lat: Number(Number(item.lat).toFixed(5)),
                          lng: Number(Number(item.lon).toFixed(5)),
                          full: item.display_name,
                        }));
                        setSearchResults([]);
                        showToast('Titik peta diperbarui!', 'success');
                      }}
                      className="flex w-full items-start gap-1.5 rounded-lg p-1.5 text-left text-[11px] hover:bg-amber-50"
                    >
                      <MapPin size={13} className="mt-0.5 shrink-0 text-gold-600" />
                      <span className="line-clamp-2 text-slate-700">{item.display_name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Pin Cepat Sekitar Kampus UNPAM */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                <span className="shrink-0 text-[10px] font-semibold text-slate-400">Pin Cepat:</span>
                {QUICK_PINS.map((pin) => (
                  <button
                    key={pin.label}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        label: pin.label,
                        lat: pin.lat,
                        lng: pin.lng,
                        full: pin.full,
                      }))
                    }
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-navy-800 hover:border-gold-500 hover:bg-gold-300/20"
                  >
                    📍 {pin.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nama Penerima & Nomor Telepon / WA */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold text-navy-900">
                  <User size={13} className="text-gold-600" /> Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  placeholder="Nama lengkap penerima"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold text-navy-900">
                  <Phone size={13} className="text-gold-600" /> Nomor Telepon / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Label Tempat */}
            <div>
              <label className="mb-1 block text-xs font-bold text-navy-900">Label Lokasi</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {['Kampus UNPAM', 'Kost', 'Rumah', 'Kantor', 'Apartemen'].map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setForm({ ...form, label: lbl })}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      form.label === lbl
                        ? 'bg-navy-900 text-gold-400'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Nama tempat (mis. Kost Putri Melati / Gedung A)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
              />
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label className="mb-1 block text-xs font-bold text-navy-900">Alamat Lengkap Pengiriman *</label>
              <textarea
                rows={2}
                required
                value={form.full}
                onChange={(e) => setForm({ ...form, full: e.target.value })}
                placeholder="Nama jalan, nomor gedung/rumah, RT/RW, kelurahan, kecamatan..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
              />
            </div>

            {/* Catatan Patokan Kurir */}
            <div>
              <label className="mb-1 block text-xs font-bold text-navy-900">Catatan / Patokan Kurir (Opsional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Mis: Titip di pos satpam / pagar warna hitam / lobby gedung B"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gold-400 py-3 text-sm font-extrabold text-navy-900 shadow-md hover:bg-gold-500 active:scale-[0.99] transition"
              >
                Simpan Lokasi & Nomor HP
              </button>
            </div>
          </form>
        ) : (
          /* DAFTAR ALAMAT TERSIMPAN + TOMBOL TAMBAH */
          <div>
            <div className="mb-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(null)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy-900 py-2.5 text-xs font-extrabold text-gold-400 shadow-sm hover:bg-navy-800 active:scale-[0.99] transition"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Tambah Alamat & No. HP Baru</span>
              </button>
              <button
                type="button"
                onClick={() => openEdit(address)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-navy-900/20 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-navy-900 hover:bg-slate-100"
              >
                <Edit3 size={14} />
                <span>Ubah Aktif</span>
              </button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto pr-0.5 thin-scrollbar">
              {addresses.map((a) => {
                const active = a.id === address?.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => {
                      setAddressId(a.id);
                      onClose?.();
                      showToast(`Pengiriman ke ${a.label} (${a.phone})`, 'success');
                    }}
                    className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 text-left transition ${
                      active ? 'border-gold-500 bg-gold-300/15' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <MapPin className={active ? 'mt-0.5 shrink-0 text-gold-600' : 'mt-0.5 shrink-0 text-slate-400'} size={20} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-extrabold text-navy-900">{a.label}</span>
                        {active && (
                          <span className="flex items-center gap-0.5 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-extrabold text-navy-900">
                            <Check size={10} strokeWidth={3} /> Dipakai
                          </span>
                        )}
                        <span className="ml-auto rounded-full bg-navy-900/10 px-2 py-0.5 text-[10px] font-bold text-navy-800">
                          {a.distanceKm || 0.9} km • ~{Math.max(5, Math.min(15, Math.round((a.distanceKm || 0.9) * 5)))} mnt
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-bold text-navy-800">
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-slate-500" /> {a.recipient || userProfile?.name}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Phone size={12} /> {a.phone || userProfile?.phone}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-slate-600">{a.full}</div>
                      {a.notes && <div className="mt-0.5 text-[11px] text-slate-400">Patokan: {a.notes}</div>}

                      <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openEdit(a)}
                          className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-navy-800 hover:bg-navy-900 hover:text-gold-400 transition"
                        >
                          <Edit3 size={11} /> Ubah Detail / No. HP
                        </button>
                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteAddress(a.id)}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-100"
                          >
                            <Trash2 size={11} /> Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
