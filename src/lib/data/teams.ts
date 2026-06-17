import type { Team } from "./types";

/**
 * Campañas de equipos (deportes de equipo).
 * Se puede bancar al equipo entero (se reparte entre el plantel) o a un jugador.
 * `member_slugs` apunta a atletas del seed con `team` igual a este slug.
 */
export const SEED_TEAMS: Team[] = [
  {
    id: "handball-arg",
    slug: "handball-arg",
    name: "Equipo Argentino de Handball",
    sport: "handball",
    discipline: "Selección masculina",
    city: "Buenos Aires",
    province: "Argentina",
    bio: "El handball argentino se ganó un lugar entre la elite a pura garra, casi siempre con menos recursos que sus rivales europeos. Este plantel pelea por meterse en el próximo Mundial concentrando, viajando y entrenando con lo justo. Tu aporte se reparte en partes iguales entre los jugadores.",
    goal_amount: 24000,
    raised_amount: 9900,
    photo_url: "/teams/handball-arg.webp",
    stats: [
      ["14", "Jugadores"],
      ["Mundial", "Objetivo"],
      ["#1", "Sudamérica"],
    ],
    fund_items: [
      ["Concentraciones", "Giras y amistosos preparatorios en Europa."],
      ["Logística", "Pasajes, estadía y comida de toda la delegación."],
      ["Cuerpo técnico", "Entrenadores, médicos y preparadores físicos."],
    ],
    verified: true,
    member_slugs: ["bruno-vidal", "lautaro-gomez", "nicolas-funes", "inaki-perez"],
    created_at: "2026-02-05T10:00:00Z",
  },
  {
    id: "hockey-arg",
    slug: "hockey-arg",
    name: "Equipo Argentino de Hockey",
    sport: "hockey",
    discipline: "Selección femenina",
    city: "Buenos Aires",
    province: "Argentina",
    bio: "Una de las camadas más prometedoras del hockey argentino va por su lugar en el Mundial. Entrenan doble turno, estudian o trabajan en paralelo y se bancan buena parte de los viajes. Tu aporte se reparte en partes iguales entre las jugadoras.",
    goal_amount: 26000,
    raised_amount: 10400,
    photo_url: "/teams/hockey-arg.webp",
    stats: [
      ["16", "Jugadoras"],
      ["Mundial", "Objetivo"],
      ["Oro", "Panamericano"],
    ],
    fund_items: [
      ["Gira internacional", "Torneos clasificatorios fuera del país."],
      ["Equipamiento", "Palos, protecciones e indumentaria del plantel."],
      ["Preparación", "Cuerpo técnico, físico y nutrición."],
    ],
    verified: true,
    member_slugs: ["delfina-castro", "morena-ruiz", "abril-sosa", "juana-mendez"],
    created_at: "2026-02-05T10:00:00Z",
  },
  {
    id: "voley-arg",
    slug: "voley-arg",
    name: "Equipo Argentino de Vóley",
    sport: "voley",
    discipline: "Selección masculina",
    city: "Buenos Aires",
    province: "Argentina",
    bio: "Con una mística que enamora, el vóley argentino sueña con repetir las grandes hazañas de su historia. Este plantel joven necesita competir afuera para llegar al Mundial en su mejor forma. Tu aporte se reparte en partes iguales entre los jugadores.",
    goal_amount: 22000,
    raised_amount: 9900,
    photo_url: "/teams/voley-arg.webp",
    stats: [
      ["14", "Jugadores"],
      ["Mundial", "Objetivo"],
      ["Top 8", "Ranking FIVB"],
    ],
    fund_items: [
      ["Competencias", "Ventana de partidos internacionales y amistosos."],
      ["Logística", "Pasajes y estadía de la delegación completa."],
      ["Cuerpo técnico", "Entrenadores, físicos y recuperación."],
    ],
    verified: true,
    member_slugs: ["ivan-torres", "facundo-ledesma", "bautista-rios", "thiago-paz"],
    created_at: "2026-02-05T10:00:00Z",
  },
];
