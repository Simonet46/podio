/**
 * Monograma grande de iniciales sobre panel de color por deporte.
 * Placeholder elegante hasta tener fotos reales (photo_url=null).
 */
export function Monogram({
  name,
  color,
  className = "",
}: {
  name: string;
  color: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      <span
        className="font-display font-bold leading-none text-white/90"
        style={{
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          textShadow: "0 2px 18px rgba(0,0,0,0.25)",
        }}
      >
        {initials}
      </span>
    </div>
  );
}
