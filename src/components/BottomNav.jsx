import { Home, Receipt, ShoppingCart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';

export default function BottomNav() {
  const { tab, go } = useUi();
  const { cartCount } = useStore();
  const items = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'cart', label: 'Keranjang', icon: ShoppingCart, badge: cartCount },
    { key: 'orders', label: 'Transaksi', icon: Receipt },
    { key: 'profile', label: 'Profil', icon: User },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur @3xl:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {items.map(({ key, label, icon: Icon, badge }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => go(key)} className="relative flex flex-col items-center gap-0.5 py-2.5">
              {active && <span className="absolute top-0 h-1 w-8 rounded-b-full bg-gold-400" />}
              <span className="relative">
                <Icon size={22} className={active ? 'fill-navy-900/10 text-navy-900' : 'text-slate-400'} strokeWidth={active ? 2.5 : 2} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{badge}</span>
                )}
              </span>
              <span className={`text-[11px] ${active ? 'font-extrabold text-navy-900' : 'font-medium text-slate-500'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
