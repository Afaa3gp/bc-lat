import { Sparkles } from 'lucide-react';
import { categories } from '../data/categories';
import { useUi } from '../context/UiContext';
import { SectionTitle, SmartImage } from './ui';

/** Grid "Spesial di BC-LAT" ala kartu kategori Astro */
export default function CategoryGrid() {
  const { openCategory, category } = useUi();
  return (
    <section>
      <SectionTitle title="Spesial di BC-LAT" icon={<Sparkles size={18} className="text-gold-500" />} />
      <div className="grid auto-cols-[30%] grid-flow-col grid-rows-2 gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar @xl:auto-cols-[22%] @3xl:grid-flow-row @3xl:grid-cols-8 @3xl:grid-rows-1 @3xl:px-0">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => openCategory(category === c.id ? null : c.id)}
            className={`group flex flex-col overflow-hidden rounded-2xl text-left shadow-sm ring-2 transition hover:-translate-y-0.5 hover:shadow-md ${
              category === c.id ? 'ring-gold-500' : 'ring-transparent'
            }`}
            style={{ background: c.color }}
          >
            <div className="h-9 px-2 pt-2 text-center text-[11px] leading-tight font-extrabold text-navy-900">{c.name}</div>
            <SmartImage
              src={c.image}
              alt={c.name}
              emoji={c.emoji}
              bg={c.color}
              className="aspect-[4/3] w-full transition group-hover:scale-105"
              emojiClass="text-4xl"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
