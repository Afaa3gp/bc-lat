import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProduct } from '../data/products';
import { DELIVERY_FEE, evaluateVoucher, findVoucher } from '../data/vouchers';

const StoreContext = createContext(null);
const STORAGE_KEY = 'bclat-store-v1';

/** Tahapan pesanan (dalam menit simulasi sejak order dibuat) */
export const ORDER_STEPS = [
  { key: 'confirmed', at: 0, label: 'Pesanan dikonfirmasi', desc: 'Dark Store BC-LAT menerima pesananmu' },
  { key: 'packing', at: 2, label: 'Sedang dikemas', desc: 'Picker menyiapkan belanjaan ke kantong ramah lingkungan' },
  { key: 'on_delivery', at: 6, label: 'Kurir menuju lokasi', desc: 'Kurir Kilat sedang dalam perjalanan' },
  { key: 'delivered', at: 14, label: 'Pesanan tiba', desc: 'Belanjaan sudah sampai. Selamat menikmati!' },
];
export const ETA_MINUTES = 15;

const COURIERS = [
  { name: 'Budi Santoso', vehicle: 'Honda Beat Hitam', plate: 'AB 4521 KL' },
  { name: 'Rina Kartika', vehicle: 'Yamaha Mio Biru', plate: 'AB 3317 UX' },
  { name: 'Dimas Prasetyo', vehicle: 'Honda Vario Putih', plate: 'AB 6802 ZE' },
];

const defaultAddresses = [
  { id: 'addr-1', label: 'Kost', recipient: 'Kelompok BC-LAT', phone: '0812-3456-7890', full: 'Kost Putri Kenanga No. 12, Jl. Kaliurang KM 5, Sleman', notes: 'Pagar hijau, titip satpam' },
  { id: 'addr-2', label: 'Kampus', recipient: 'Kelompok BC-LAT', phone: '0812-3456-7890', full: 'Gedung Fakultas Ekonomi & Bisnis, Lobby Utama', notes: 'Hubungi saat sampai' },
  { id: 'addr-3', label: 'Rumah', recipient: 'Kelompok BC-LAT', phone: '0812-3456-7890', full: 'Jl. Melati Raya No. 8, Depok, Sleman', notes: '' },
];

const initialState = () => ({
  cart: {}, // { productId: qty }
  voucherCode: '',
  orders: [],
  addresses: defaultAddresses,
  addressId: 'addr-1',
  stock: {}, // pengurangan stok: { productId: soldQty }
  demoSpeed: 15, // 1 = waktu nyata, 15 = 15 menit jadi 1 menit
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...JSON.parse(raw) };
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

  const placeOrder = useCallback(
    (paymentMethod) => {
      const address = state.addresses.find((a) => a.id === state.addressId);
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
        address,
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
    [state.addresses, state.addressId, state.orders.length, state.demoSpeed, cartItems, subtotal, voucherResult, deliveryFee, total, voucher]
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
    address: state.addresses.find((a) => a.id === state.addressId),
    stockLeft,
    setQty,
    addToCart,
    applyVoucher,
    removeVoucher,
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
