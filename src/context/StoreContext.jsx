import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '../data/products';
import { DELIVERY_FEE, evaluateVoucher, findVoucher } from '../data/vouchers';

const StoreContext = createContext(null);
const STORAGE_KEY = 'bclat-store-v3';

/** Tahapan pesanan (dalam menit simulasi sejak order dibuat) */
export const ORDER_STEPS = [
  { key: 'confirmed', at: 0, label: 'Pesanan dikonfirmasi', desc: 'Dark Store BC-LAT menerima pesananmu' },
  { key: 'packing', at: 2, label: 'Sedang dikemas', desc: 'Picker menyiapkan belanjaan ke kantong ramah lingkungan' },
  { key: 'on_delivery', at: 6, label: 'Kurir menuju lokasi', desc: 'Kurir Kilat sedang dalam perjalanan' },
  { key: 'delivered', at: 14, label: 'Pesanan tiba', desc: 'Belanjaan sudah sampai. Selamat menikmati!' },
];
export const ETA_MINUTES = 15;

const COURIERS = [
  { name: 'Budi Santoso', vehicle: 'Honda Beat Hitam', plate: 'B 4521 KLA', phone: '0813-8821-4521' },
  { name: 'Rina Kartika', vehicle: 'Yamaha Mio Biru', plate: 'B 3317 UXA', phone: '0812-9904-3317' },
  { name: 'Dimas Prasetyo', vehicle: 'Honda Vario Putih', plate: 'B 6802 ZEA', phone: '0857-7120-6802' },
];

export const DARK_STORE_HUB = {
  name: 'Dark Store BC-LAT Hub Pamulang',
  address: 'Jl. Surya Kencana No. 18, Pamulang Barat, Tangerang Selatan',
  lat: -6.3485,
  lng: 106.7352,
};

/** Hitung jarak garis jalan (estimasi km) dari Dark Store Hub */
export function calcHubDistanceKm(lat, lng) {
  const R = 6371;
  const dLat = ((lat - DARK_STORE_HUB.lat) * Math.PI) / 180;
  const dLng = ((lng - DARK_STORE_HUB.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((DARK_STORE_HUB.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const straight = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(0.2, Number((straight * 1.25).toFixed(1)));
}

const defaultProfile = {
  name: 'Kelompok Bisnis BC-LAT',
  phone: '0812-3456-7890',
  email: 'demo@bc-lat.web.id',
};

const defaultAddresses = [
  {
    id: 'addr-1',
    label: 'Kampus UNPAM',
    recipient: 'Kelompok BC-LAT',
    phone: '0812-3456-7890',
    full: 'Universitas Pamulang (UNPAM), Jl. Surya Kencana No. 1, Pamulang, Tangerang Selatan',
    notes: 'Lobby Utama / Gedung Kampus A',
    lat: -6.3461,
    lng: 106.7370,
    distanceKm: 0.9,
  },
  {
    id: 'addr-2',
    label: 'UNPAM Viktor',
    recipient: 'Kelompok BC-LAT',
    phone: '0812-3456-7890',
    full: 'Universitas Pamulang Kampus 2 (Viktor), Jl. Raya Puspiptek, Serpong, Tangerang Selatan',
    notes: 'Hubungi nomor WA saat sampai gerbang depan',
    lat: -6.3478,
    lng: 106.6915,
    distanceKm: 2.8,
  },
  {
    id: 'addr-3',
    label: 'Kost Pamulang',
    recipient: 'Kelompok BC-LAT',
    phone: '0812-3456-7890',
    full: 'Jl. Pajajaran No. 12, Pamulang Barat, Tangerang Selatan',
    notes: 'Pagar hitam samping warung, dekat UNPAM',
    lat: -6.3422,
    lng: 106.7335,
    distanceKm: 1.4,
  },
];

const initialState = () => ({
  cart: {}, // { productId: qty }
  voucherCode: '',
  orders: [],
  userProfile: defaultProfile,
  addresses: defaultAddresses,
  addressId: 'addr-1',
  stock: {}, // pengurangan stok: { productId: soldQty }
  demoSpeed: 15, // 1 = waktu nyata, 15 = 15 menit jadi 1 menit
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const addresses = Array.isArray(parsed.addresses) && parsed.addresses.length > 0 ? parsed.addresses : defaultAddresses;
      const addressId = addresses.some((a) => a.id === parsed.addressId) ? parsed.addressId : addresses[0].id;
      return {
        ...initialState(),
        ...parsed,
        userProfile: { ...defaultProfile, ...(parsed.userProfile || {}) },
        addresses,
        addressId,
      };
    }
  } catch {
    /* abaikan data rusak */
  }
  return initialState();
}

/** Menit simulasi yang telah berlalu sejak order dibuat */
export function elapsedMinutes(order, now) {
  if (order.cancelled) return 0;
  const real = (now - order.createdAt) / 60000;
  return Math.max(0, real * order.speed + (order.offset || 0));
}

export function orderStatus(order, now) {
  if (order.cancelled) return { key: 'cancelled', label: 'Dibatalkan', index: -1 };
  const m = elapsedMinutes(order, now);
  let index = 0;
  ORDER_STEPS.forEach((s, i) => {
    if (m >= s.at) index = i;
  });
  return { ...ORDER_STEPS[index], index, minutes: m };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Ticker untuk animasi live tracking
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = useCallback((message, tone = 'default') => {
    setToast({ message, tone, id: Math.random() });
    setTimeout(() => setToast(null), 2200);
  }, []);

  const stockLeft = useCallback(
    (id) => (getProduct(id)?.stock ?? 0) - (state.stock[id] || 0),
    [state.stock]
  );

  const setQty = useCallback(
    (id, qty) => {
      setState((s) => {
        const cart = { ...s.cart };
        const max = (getProduct(id)?.stock ?? 0) - (s.stock[id] || 0);
        const next = Math.max(0, Math.min(qty, max));
        if (next === 0) delete cart[id];
        else cart[id] = next;
        return { ...s, cart };
      });
    },
    []
  );

  const addToCart = useCallback(
    (id) => {
      setQty(id, (state.cart[id] || 0) + 1);
      if (!state.cart[id]) showToast(`${getProduct(id).name} masuk keranjang`);
    },
    [setQty, state.cart, showToast]
  );

  const cartItems = useMemo(
    () =>
      Object.entries(state.cart)
        .map(([id, qty]) => ({ product: getProduct(id), qty }))
        .filter((x) => x.product),
    [state.cart]
  );

  const cartCount = cartItems.reduce((a, x) => a + x.qty, 0);
  const subtotal = cartItems.reduce((a, x) => a + x.qty * x.product.price, 0);
  const savings = cartItems.reduce((a, x) => a + x.qty * (x.product.originalPrice - x.product.price), 0);
  const voucher = state.voucherCode ? findVoucher(state.voucherCode) : null;
  const voucherResult = evaluateVoucher(voucher, subtotal);
  const deliveryFee = Math.max(0, DELIVERY_FEE - voucherResult.shippingDiscount);
  const total = Math.max(0, subtotal - voucherResult.discount + deliveryFee);

  const applyVoucher = useCallback(
    (code) => {
      const v = findVoucher(code);
      if (!v) {
        showToast('Kode voucher tidak ditemukan', 'error');
        return false;
      }
      setState((s) => ({ ...s, voucherCode: v.code }));
      showToast(`Voucher ${v.code} dipakai`, 'success');
      return true;
    },
    [showToast]
  );

  const removeVoucher = useCallback(() => setState((s) => ({ ...s, voucherCode: '' })), []);

  const updateProfile = useCallback(
    (patch) => {
      setState((s) => ({
        ...s,
        userProfile: { ...s.userProfile, ...patch },
      }));
      showToast('Profil & nomor telepon disimpan', 'success');
    },
    [showToast]
  );

  const saveAddress = useCallback(
    (addrInput) => {
      const lat = Number(addrInput.lat) || -6.3461;
      const lng = Number(addrInput.lng) || 106.7370;
      const distanceKm = addrInput.distanceKm || calcHubDistanceKm(lat, lng);
      const clean = {
        id: addrInput.id || `addr-${Date.now()}`,
        label: (addrInput.label || 'Lokasi Saya').trim(),
        recipient: (addrInput.recipient || state.userProfile.name || 'Pelanggan BC-LAT').trim(),
        phone: (addrInput.phone || state.userProfile.phone || '0812-3456-7890').trim(),
        full: (addrInput.full || '').trim(),
        notes: (addrInput.notes || '').trim(),
        lat,
        lng,
        distanceKm,
      };
      setState((s) => {
        const exists = s.addresses.some((a) => a.id === clean.id);
        const addresses = exists
          ? s.addresses.map((a) => (a.id === clean.id ? clean : a))
          : [clean, ...s.addresses];
        return {
          ...s,
          addresses,
          addressId: clean.id,
          userProfile: {
            ...s.userProfile,
            name: clean.recipient || s.userProfile.name,
            phone: clean.phone || s.userProfile.phone,
          },
        };
      });
      showToast(`Lokasi "${clean.label}" berhasil disimpan`, 'success');
      return clean;
    },
    [state.userProfile, showToast]
  );

  const updateActiveAddressField = useCallback((patch) => {
    setState((s) => {
      const addresses = s.addresses.map((a) => (a.id === s.addressId ? { ...a, ...patch } : a));
      return {
        ...s,
        addresses,
        userProfile: {
          ...s.userProfile,
          ...(patch.recipient ? { name: patch.recipient } : {}),
          ...(patch.phone ? { phone: patch.phone } : {}),
        },
      };
    });
  }, []);

  const deleteAddress = useCallback(
    (id) => {
      setState((s) => {
        if (s.addresses.length <= 1) return s;
        const addresses = s.addresses.filter((a) => a.id !== id);
        const addressId = s.addressId === id ? addresses[0].id : s.addressId;
        return { ...s, addresses, addressId };
      });
      showToast('Alamat dihapus', 'default');
    },
    [showToast]
  );

  const placeOrder = useCallback(
    (paymentMethod) => {
      const address = state.addresses.find((a) => a.id === state.addressId) || state.addresses[0];
      const d = new Date();
      const seq = String(state.orders.length + 1).padStart(3, '0');
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
      const order = {
        id: `ord-${Date.now()}`,
        number: `BCL-${ymd}-${seq}`,
        createdAt: Date.now(),
        speed: state.demoSpeed,
        offset: 0,
        items: cartItems.map((x) => ({ id: x.product.id, name: x.product.name, size: x.product.size, emoji: x.product.emoji, image: x.product.image, price: x.product.price, qty: x.qty })),
        subtotal,
        discount: voucherResult.discount,
        deliveryFee,
        total,
        voucherCode: voucher && !voucherResult.error ? voucher.code : null,
        paymentMethod,
        address: {
          ...address,
          recipient: address.recipient || state.userProfile.name,
          phone: address.phone || state.userProfile.phone,
        },
        courier: COURIERS[state.orders.length % COURIERS.length],
        cancelled: false,
      };
      setState((s) => {
        const stock = { ...s.stock };
        order.items.forEach((it) => (stock[it.id] = (stock[it.id] || 0) + it.qty));
        return { ...s, orders: [order, ...s.orders], cart: {}, voucherCode: '', stock };
      });
      return order;
    },
    [state.addresses, state.addressId, state.userProfile, state.orders.length, state.demoSpeed, cartItems, subtotal, voucherResult, deliveryFee, total, voucher]
  );

  /** Admin/presenter: majukan status pesanan ke tahap berikutnya */
  const advanceOrder = useCallback((orderId) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId || o.cancelled) return o;
        const m = elapsedMinutes(o, Date.now());
        const next = ORDER_STEPS.find((st) => st.at > m);
        if (!next) return o;
        return { ...o, offset: (o.offset || 0) + (next.at - m) + 0.01 };
      }),
    }));
  }, []);

  const cancelOrder = useCallback((orderId) => {
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, cancelled: true } : o)) }));
  }, []);

  const reorder = useCallback(
    (order) => {
      setState((s) => {
        const cart = { ...s.cart };
        order.items.forEach((it) => (cart[it.id] = (cart[it.id] || 0) + it.qty));
        return { ...s, cart };
      });
      showToast('Item pesanan dimasukkan ke keranjang', 'success');
    },
    [showToast]
  );

  const setAddressId = useCallback((id) => setState((s) => ({ ...s, addressId: id })), []);
  const setDemoSpeed = useCallback((v) => setState((s) => ({ ...s, demoSpeed: v })), []);
  const resetDemo = useCallback(() => {
    setState(initialState());
    showToast('Data demo direset', 'success');
  }, [showToast]);

  const value = {
    ...state,
    now,
    toast,
    showToast,
    cartItems,
    cartCount,
    subtotal,
    savings,
    voucher,
    voucherResult,
    deliveryFee,
    total,
    address: state.addresses.find((a) => a.id === state.addressId) || state.addresses[0],
    stockLeft,
    setQty,
    addToCart,
    applyVoucher,
    removeVoucher,
    updateProfile,
    saveAddress,
    updateActiveAddressField,
    deleteAddress,
    placeOrder,
    advanceOrder,
    cancelOrder,
    reorder,
    setAddressId,
    setDemoSpeed,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
