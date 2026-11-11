import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, Zap } from 'lucide-react';
import { getCategory } from '../data/categories';

/** Gambar dengan fallback ilustrasi emoji jika file belum tersedia */
export function SmartImage({ src, alt, emoji = '🛒', bg = '#F1F5F9', className = '', emojiClass = 'text-5xl' }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: `radial-gradient(circle at 30% 25%, #ffffff 0%, ${bg} 75%)` }}
        role="img"
        aria-label={alt}
      >
        <span className={`${emojiClass} drop-shadow-sm select-none`}>{emoji}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export function ProductImage({ product, className = '', emojiClass }) {
  return (
    <SmartImage
      src={product.image}
      alt={product.name}
      emoji={product.emoji}
      bg={getCategory(product.category)?.color}
      className={className}
      emojiClass={emojiClass}
    />
  );
}

/** Logo teks BC-⚡LAT sesuai identitas brand */
export function Logo({ size = 'md', tagline = false }) {
  const s = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }[size];
  return (
    <div className="leading-none select-none">
      <div className={`flex items-center font-extrabold tracking-tight ${s}`}>
        <span className="text-gold-gradient">BC-</span>
        <Zap className="-mx-0.5 h-[1em] w-[0.8em] fill-gold-400 text-gold-400 drop-shadow" strokeWidth={1.5} />
        <span className="text-gold-gradient">LAT</span>
      </div>
      {tagline && (
        <div className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-gold-300/90 uppercase">
          Market Online • Keperluan Sehari-hari
        </div>
      )}
    </div>
  );
}

export function QtyStepper({ qty, onChange, max, size = 'md', full = false }) {
  const h = size === 'sm' ? 'h-8' : 'h-9';
  return (
    <div className={`flex items-center justify-between rounded-xl border border-navy-900/15 bg-white ${h} ${full ? 'w-full' : ''}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange(qty - 1);
        }}
        className="flex h-full w-9 items-center justify-center rounded-l-xl text-navy-900 hover:bg-slate-100 active:scale-90"
        aria-label="Kurangi"
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-navy-900">{qty}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange(qty + 1);
        }}
        disabled={max !== undefined && qty >= max}
        className="flex h-full w-9 items-center justify-center rounded-r-xl bg-navy-900 text-gold-400 hover:bg-navy-800 active:scale-90 disabled:opacity-40"
        aria-label="Tambah"
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function SectionTitle({ title, action, onAction, icon }) {
  return (
    <div className="mb-3 flex items-end justify-between px-4 @3xl:px-0">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-navy-900 @3xl:text-xl">
        {icon}
        {title}
      </h2>
      {action && (
        <button onClick={onAction} className="text-sm font-bold text-navy-600 hover:text-gold-600">
          {action}
        </button>
      )}
    </div>
  );
}

/** Lapisan modal/bottom-sheet. Pada tampilan sempit tampil sebagai bottom sheet. */
export function Sheet({ open, onClose, children, wide = false, noScroll = false }) {
  if (!open) return null;
  const content = (
    <div className="fixed inset-0 z-[70] flex items-end justify-center @3xl:items-center">
      <div className="animate-fade-in absolute inset-0 bg-navy-950/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`animate-slide-up relative max-h-[90dvh] w-full ${
          noScroll ? 'overflow-hidden' : 'overflow-y-auto thin-scrollbar'
        } rounded-t-3xl bg-white shadow-2xl @3xl:animate-pop @3xl:max-h-[88vh] @3xl:rounded-3xl ${
          wide ? '@3xl:max-w-3xl' : '@3xl:max-w-lg'
        }`}
      >
        {children}
      </div>
    </div>
  );
  const portalTarget = typeof document !== 'undefined' ? document.getElementById('sheet-portal') || document.body : null;
  return portalTarget ? createPortal(content, portalTarget) : content;
}

export const discountPct = (p) => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
