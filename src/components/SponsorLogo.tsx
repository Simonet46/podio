import { asset } from "@/config/site";
import type { Sponsor } from "@/lib/data/sponsors";

/**
 * Logo del sponsor: usa la imagen si existe, si no muestra el nombre estilizado
 * con el color de la marca (placeholder elegante hasta tener el logo real).
 */
export function SponsorLogo({
  sponsor,
  className = "",
}: {
  sponsor: Sponsor;
  className?: string;
}) {
  if (sponsor.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={asset(sponsor.logo)}
        alt={sponsor.name}
        className={`h-8 w-auto object-contain ${className}`}
      />
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-xl font-700 tracking-tight ${className}`}
      style={{ color: sponsor.color }}
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: sponsor.color }}
        aria-hidden
      />
      {sponsor.name}
    </span>
  );
}
