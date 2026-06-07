import Link from "next/link";

/** Bloc CTA or — SANS PRIX : promesse + liste ✅ + un seul bouton vers href. */
export default function CTABox({
  title,
  subtitle,
  features = [],
  href,
  buttonText,
}: {
  title: string;
  subtitle?: string;
  features?: string[];
  href: string;
  buttonText: string;
}) {
  return (
    <div className="not-prose my-10 rounded-2xl border border-[#C5A04E]/40 bg-gradient-to-b from-[#C5A04E]/12 to-transparent p-7 text-center sm:p-9">
      <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">{title}</h3>
      {subtitle && <p className="mt-3 leading-relaxed text-gray-300">{subtitle}</p>}
      {features.length > 0 && (
        <ul className="mx-auto mt-5 max-w-md space-y-2 text-right">
          {features.map((f, i) => (
            <li key={i} className="text-[15px] leading-relaxed text-gray-200">
              {f}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={href}
        className="mt-6 inline-block rounded-xl bg-[#C5A04E] px-7 py-3.5 text-base font-bold text-[#0A0A0A] transition-all duration-200 hover:bg-[#d4b35e] hover:shadow-[0_0_24px_-4px_rgba(197,160,78,0.6)]"
      >
        {buttonText}
      </Link>
    </div>
  );
}
