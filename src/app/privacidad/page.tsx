import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `Política de Privacidad — ${SITE.brand}`,
  robots: { index: true, follow: true },
};

const ACTUALIZADO = "28 de junio de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main className="bg-ink text-white">
        <article className="mx-auto max-w-[820px] px-4 pb-24 pt-12 sm:px-6">
          {/* Aviso de borrador */}
          <div
            className="mb-8 rounded-[12px] p-4 text-[13px] leading-relaxed"
            style={{ background: "rgba(201,162,39,.1)", border: "1px solid rgba(201,162,39,.32)", color: "#e3c768" }}
          >
            ⚠️ <strong>Borrador — pendiente de revisión legal.</strong> Este texto es
            un modelo de referencia, no asesoramiento legal. Antes de publicarlo
            definitivamente, debe revisarlo un abogado/a y deben completarse los
            datos entre [corchetes].
          </div>

          <p className="eyebrow text-gold">Legal</p>
          <h1 className="mt-2 font-display text-[40px] font-700 uppercase leading-none tracking-tight sm:text-[52px]">
            Política de Privacidad
          </h1>
          <p className="mt-3 text-[14px] text-white/50">Última actualización: {ACTUALIZADO}</p>

          <div className="prose-legal mt-8 flex flex-col gap-7 text-[15px] leading-relaxed text-white/75">
            <Section n="1" title="Quién es responsable de tus datos">
              <p>
                El responsable del tratamiento de los datos personales es{" "}
                <strong>[Razón social — ej. Granito Asociación Civil]</strong>, CUIT{" "}
                <strong>[CUIT]</strong>, con domicilio en <strong>[domicilio legal]</strong>,
                Argentina (en adelante, “{SITE.brand}”, “nosotros”). Para cualquier
                consulta sobre tus datos podés escribirnos a{" "}
                <strong>[email de contacto]</strong>.
              </p>
            </Section>

            <Section n="2" title="Qué datos recopilamos">
              <p>Cuando te postulás o usás la plataforma, podemos recopilar:</p>
              <ul className="mt-2 list-disc pl-5">
                <li><strong>Datos de identificación y contacto:</strong> nombre, apellido, edad, email, ciudad/provincia.</li>
                <li><strong>Datos deportivos:</strong> deporte, disciplina, competencias, logros, tu historia.</li>
                <li><strong>Imágenes:</strong> fotos de perfil y de acción que subís.</li>
                <li><strong>Datos de cobro:</strong> alias/CVU/email de Mercado Pago, email o link de PayPal, para que recibas los aportes.</li>
                <li><strong>Redes sociales:</strong> el usuario o link que nos compartas.</li>
                <li><strong>Datos técnicos:</strong> información del navegador y registros de uso necesarios para operar el sitio.</li>
              </ul>
            </Section>

            <Section n="3" title="Para qué usamos tus datos">
              <ul className="list-disc pl-5">
                <li>Revisar y aprobar tu postulación.</li>
                <li>Crear y mostrar tu perfil público de atleta o la campaña de tu equipo.</li>
                <li>Permitir que las personas te apoyen y que los aportes lleguen a tu cuenta de cobro.</li>
                <li>Comunicarnos con vos sobre tu postulación o tu perfil.</li>
                <li>Cumplir obligaciones legales y prevenir fraudes o usos indebidos.</li>
              </ul>
              <p className="mt-2">
                Tené en cuenta que el perfil del atleta y la campaña del equipo son{" "}
                <strong>públicos</strong>: nombre, deporte, ciudad, historia y fotos
                se muestran en el sitio. Los datos de cobro y de contacto{" "}
                <strong>no</strong> se publican.
              </p>
            </Section>

            <Section n="4" title="Base legal del tratamiento">
              <p>
                Tratamos tus datos sobre la base de tu <strong>consentimiento</strong>,
                que prestás al aceptar esta política y los Términos al postularte, y en
                el marco de la <strong>Ley 25.326 de Protección de los Datos Personales</strong>{" "}
                de la República Argentina y su normativa reglamentaria. Podés retirar tu
                consentimiento en cualquier momento (ver punto 9).
              </p>
            </Section>

            <Section n="5" title="Con quién compartimos tus datos">
              <p>No vendemos tus datos. Los compartimos únicamente con:</p>
              <ul className="mt-2 list-disc pl-5">
                <li><strong>Proveedores de infraestructura</strong> que alojan la plataforma y la base de datos (por ejemplo, servicios de hosting y de base de datos como Supabase).</li>
                <li><strong>Procesadores de pago</strong> (Mercado Pago, PayPal u otros) para que los aportes lleguen a tu cuenta. Su uso se rige por sus propias políticas de privacidad.</li>
                <li><strong>Autoridades</strong>, cuando una ley o una orden judicial lo requiera.</li>
              </ul>
              <p className="mt-2">
                Algunos proveedores pueden alojar datos fuera de Argentina; en ese caso
                procuramos que existan garantías adecuadas de protección.
              </p>
            </Section>

            <Section n="6" title="Fotos y derechos de imagen">
              <p>
                Al subir fotos y postularte, nos autorizás a publicar y mostrar esas
                imágenes en tu perfil público y en materiales de difusión de {SITE.brand},
                con el fin de promover tu campaña de apoyo. Podés pedir que retiremos tus
                imágenes en cualquier momento escribiéndonos. Si las fotos incluyen a
                otras personas, declarás contar con su autorización.
              </p>
            </Section>

            <Section n="7" title="Menores de edad">
              <p>
                Si sos menor de 18 años, tu postulación requiere el{" "}
                <strong>consentimiento de tu madre, padre o tutor/a legal</strong>, quien
                debe aceptar esta política y los Términos en tu nombre, incluyendo el uso
                de tu imagen. Si detectamos datos de una persona menor sin esa
                autorización, podemos suspender o eliminar la postulación.
              </p>
            </Section>

            <Section n="8" title="Cuánto tiempo conservamos tus datos">
              <p>
                Conservamos tus datos mientras tu perfil esté activo o sea necesario para
                las finalidades descriptas, y luego durante los plazos que exijan las
                obligaciones legales aplicables. Después, los eliminamos o anonimizamos.
              </p>
            </Section>

            <Section n="9" title="Tus derechos">
              <p>
                Como titular de los datos, tenés derecho a <strong>acceder, rectificar,
                actualizar y suprimir</strong> tus datos personales, y a retirar tu
                consentimiento. Para ejercerlos, escribinos a <strong>[email de contacto]</strong>.
              </p>
              <p className="mt-2">
                La <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>, órgano
                de control de la Ley 25.326, tiene la atribución de atender denuncias y
                reclamos relativos al incumplimiento de las normas sobre protección de
                datos personales.
              </p>
            </Section>

            <Section n="10" title="Seguridad">
              <p>
                Aplicamos medidas técnicas y organizativas razonables para proteger tus
                datos. Ningún sistema es 100% infalible, pero trabajamos para reducir los
                riesgos de acceso o uso no autorizado.
              </p>
            </Section>

            <Section n="11" title="Cambios en esta política">
              <p>
                Podemos actualizar esta política. Cuando haya cambios relevantes, lo
                informaremos en el sitio y actualizaremos la fecha de “última
                actualización”.
              </p>
            </Section>

            <Section n="12" title="Contacto">
              <p>
                Por cualquier consulta sobre privacidad o tus datos, escribinos a{" "}
                <strong>[email de contacto]</strong>.
              </p>
            </Section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-display text-[20px] font-600 uppercase tracking-wide text-white">
        {n}. {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}
