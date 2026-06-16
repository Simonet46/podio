"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revela su contenido con un fade + slide suave (storytelling scroll-driven,
 * estilo "Become a Yogi").
 *
 * A prueba de fallos: el contenido NUNCA queda invisible.
 * - prefers-reduced-motion → aparece de una, sin animación.
 * - Ya visible al montar → anima al instante (entrada en carga).
 * - Más abajo → anima al entrar en viewport (IntersectionObserver).
 * - Failsafe: si el observer no dispara (entornos raros), revela igual.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => setShown(true);

    // Sin animación si el usuario prefiere movimiento reducido.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    // Si ya está (casi) en viewport al montar, anima de entrada.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      reveal();
      return;
    }

    let fired = false;
    let obs: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== "undefined") {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fired = true;
            reveal();
            obs?.disconnect();
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
      );
      obs.observe(el);
    }

    // Failsafe: nunca dejar el contenido invisible.
    const t = window.setTimeout(() => {
      if (!fired) reveal();
    }, 2500);

    return () => {
      obs?.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
