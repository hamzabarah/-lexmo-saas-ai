/** Liste "honnête" — cartes à bordure droite rouge (titre rouge + texte gris). */
export default function HonestList({ items = [] }: { items?: string[][] }) {
  return (
    <div className="not-prose my-8 space-y-3 lg:-mx-20">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border-r-4 border-red-500/70 bg-[#111111] p-4">
          <h4 className="font-bold text-red-300">{it[0]}</h4>
          <p className="mt-1 text-sm leading-relaxed text-gray-400">{it[1]}</p>
        </div>
      ))}
    </div>
  );
}
