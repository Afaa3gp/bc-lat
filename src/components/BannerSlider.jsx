import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { banners } from '../data/vouchers';

export default function BannerSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, []);

  const go = (d) => setI((x) => (x + d + banners.length) % banners.length);

  return (
    <div className="group relative mx-4 overflow-hidden rounded-3xl shadow-md @3xl:mx-0">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {banners.map((b) => (
          <div key={b.id} className="relative aspect-[2/1] w-full shrink-0 @3xl:aspect-[3/1]" style={{ background: b.bg }}>
            <img src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/40 to-transparent" />
            <div className="relative flex h-full max-w-[62%] flex-col justify-center p-5 @3xl:max-w-[48%] @3xl:p-10">
              <span className="mb-2 w-fit rounded-full bg-gold-400 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-navy-900 @3xl:text-xs">{b.eyebrow}</span>
              <h3 className="text-lg leading-tight font-extrabold text-white @3xl:text-4xl">{b.title}</h3>
              <p className="mt-1.5 text-[11px] text-slate-200 @3xl:mt-3 @3xl:text-base">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => go(-1)} className="absolute top-1/2 left-3 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-navy-900 opacity-0 shadow group-hover:opacity-100 @3xl:block" aria-label="Sebelumnya">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => go(1)} className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-navy-900 opacity-0 shadow group-hover:opacity-100 @3xl:block" aria-label="Berikutnya">
        <ChevronRight size={18} />
      </button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((b, idx) => (
          <button key={b.id} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-5 bg-gold-400' : 'w-1.5 bg-white/60'}`} aria-label={`Banner ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}
