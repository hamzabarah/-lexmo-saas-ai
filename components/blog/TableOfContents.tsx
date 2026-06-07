"use client";

import { useEffect, useState } from "react";

/**
 * Sommaire auto-généré depuis les H2 du corps de l'article (#article-body).
 * Assigne un id stable à chaque H2 si absent, puis génère des liens cliquables
 * avec scroll fluide.
 */
export default function TableOfContents() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const root = document.getElementById("article-body");
    if (!root) return;
    const hs = Array.from(root.querySelectorAll("h2"));
    const list = hs.map((h, i) => {
      if (!h.id) h.id = `sec-${i}`;
      return { id: h.id, text: (h.textContent ?? "").trim() };
    });
    setItems(list);
  }, []);

  if (items.length === 0) return null;

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="not-prose my-8 rounded-2xl border border-white/10 bg-[#111111] p-5">
      <div className="mb-3 text-sm font-bold text-[#C5A04E]">محتويات المقال</div>
      <ol className="space-y-2">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => go(e, it.id)}
              className="text-sm leading-relaxed text-gray-300 transition-colors hover:text-[#C5A04E]"
            >
              {i + 1}. {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
