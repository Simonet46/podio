import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-ice">
        <div className="mx-auto max-w-container px-4 py-28 text-center sm:px-6">
          <p className="font-display text-7xl font-700 text-gold">404</p>
          <h1 className="mt-4 font-display text-3xl font-700 uppercase tracking-tight text-ink">
            No encontramos esta página
          </h1>
          <p className="mt-3 text-steel">
            Puede que el atleta ya no esté en campaña o el enlace sea incorrecto.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-md bg-ink px-6 py-3 font-display text-sm font-600 uppercase tracking-wide text-white transition-colors hover:bg-ink-2"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
