"use client";

import { useState } from "react";
import { asset } from "@/config/site";
import { Monogram } from "./Monogram";

/**
 * Avatar de fundador: muestra la foto si el archivo existe; si no (todavía no
 * se subió), cae elegantemente al monograma de iniciales. Así la sección queda
 * lista y las fotos aparecen solas apenas se agregan a /public/founders/.
 */
export function FounderAvatar({
  name,
  photo,
  color,
}: {
  name: string;
  photo?: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!photo || failed) {
    return <Monogram name={name} color={color} className="h-full w-full" />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={asset(photo)}
      alt={name}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
