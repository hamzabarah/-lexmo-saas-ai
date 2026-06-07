/** Tableau comparatif RTL — en-tête or, ligne "نظام الماركة" mise en valeur. */
export default function ComparisonTable({
  title,
  rows,
  headers = ["النموذج", "هامش الربح", "ملاحظات"],
}: {
  title?: string;
  rows?: string[][];
  headers?: string[];
}) {
  const data = rows ?? [];
  return (
    <figure className="not-prose my-8 overflow-x-auto lg:-mx-20">
      {title && (
        <figcaption className="mb-3 text-center text-base font-bold text-white">{title}</figcaption>
      )}
      <table className="w-full min-w-[480px] border-collapse text-right">
        <thead>
          <tr className="bg-[#1a1a1a]">
            {headers.map((h, i) => (
              <th key={i} className="border border-white/10 px-4 py-3 text-sm font-bold text-[#C5A04E]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r, ri) => {
            const highlight = (r[0] ?? "").includes("الماركة");
            return (
              <tr key={ri} className={highlight ? "bg-[#C5A04E]/10" : "bg-[#111111]"}>
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className={`border border-white/10 px-4 py-3 text-sm ${
                      ci === 0 ? "font-bold text-white" : highlight ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}
