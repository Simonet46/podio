/** Franja decorativa de 5 colores (firma visual, NO los aros olímpicos). */
export function Ribbon({ tall = false }: { tall?: boolean }) {
  return <div className={`ribbon${tall ? " ribbon-tall" : ""}`} aria-hidden />;
}
