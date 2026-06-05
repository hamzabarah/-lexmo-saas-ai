/**
 * Drapeau pays via image (flagcdn) — fiable sur Windows où les emojis
 * drapeaux ne s'affichent pas (rendus "FR", "NL"…).
 * width/height fixés pour éviter le CLS.
 */
export default function Flag({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  const cc = code.toLowerCase();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/24x18/${cc}.png`}
      srcSet={`https://flagcdn.com/48x36/${cc}.png 2x`}
      width={24}
      height={18}
      alt={code.toUpperCase()}
      loading="lazy"
      className={`inline-block rounded-[3px] object-cover ${className}`}
    />
  );
}
