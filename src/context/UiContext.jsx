import { createContext, useContext, useState } from 'react';

const UiContext = createContext(null);

/** State navigasi aplikasi (tab, kategori aktif, pencarian, modal) */
export function UiProvider({ children }) {
  const [tab, setTab] = useState('home'); // home | cart | orders | profile | admin
  const [category, setCategory] = useState(null);
  const [query, setQuery] = useState('');
  const [productId, setProductId] = useState(null);
  const [trackingId, setTrackingId] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const go = (t) => {
    setTab(t);
    document.querySelectorAll('[data-scroll-root]').forEach((el) => el.scrollTo({ top: 0 }));
    window.scrollTo({ top: 0 });
  };

  const openCategory = (id) => {
    setCategory(id);
    setQuery('');
    go('home');
  };

  return (
    <UiContext.Provider
      value={{ tab, go, category, setCategory, openCategory, query, setQuery, productId, setProductId, trackingId, setTrackingId, checkoutOpen, setCheckoutOpen }}
    >
      {children}
    </UiContext.Provider>
  );
}

export const useUi = () => useContext(UiContext);
