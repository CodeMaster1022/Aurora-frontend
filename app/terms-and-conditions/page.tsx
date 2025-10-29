"use client"

import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function TermsAndConditionsPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-[#0F172A] pt-12">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#524FD5] mb-4">
              Términos y Condiciones de Uso – Aurora
            </h1>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">1. Aceptación de los Términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder o utilizar la plataforma Aurora (en adelante, "la Plataforma"), el usuario acepta cumplir y quedar legalmente vinculado por los presentes Términos y Condiciones de Uso. Si no está de acuerdo con ellos, deberá abstenerse de usar la Plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">2. Descripción del Servicio</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora es una plataforma digital que conecta estudiantes de inglés de nivel avanzado con personas adultas mayores, con el propósito de fomentar la práctica del idioma a través de conversaciones virtuales.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Aurora no ofrece servicios educativos formales ni terapéuticos, ni garantiza resultados académicos o personales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">3. Registro de Usuarios</h2>
            <p className="text-gray-700 leading-relaxed">
              Para acceder a la Plataforma, el usuario debe proporcionar información veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">4. Conducta de los Usuarios</h2>
            <p className="text-gray-700 leading-relaxed">
              El usuario se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Mantener un comportamiento respetuoso y apropiado durante las conversaciones.</li>
              <li>No acosar, discriminar, difundir odio, ni compartir contenido inapropiado.</li>
              <li>No usar la Plataforma para fines comerciales, políticos, religiosos o ilícitos.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Aurora se reserva el derecho de suspender o eliminar cuentas que incumplan estas normas, sin previo aviso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora actúa únicamente como intermediario tecnológico entre los usuarios.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Aurora no se hace responsable de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>El contenido o veracidad de las conversaciones mantenidas entre usuarios.</li>
              <li>Daños, perjuicios, pérdidas o incidentes derivados de la interacción entre usuarios dentro o fuera de la Plataforma.</li>
              <li>Fallos técnicos, interrupciones del servicio o pérdida de datos.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              El uso de la Plataforma se realiza bajo la exclusiva responsabilidad del usuario.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">6. Protección de Datos Personales</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora recopila y trata los datos personales conforme a su{" "}
              <a href="/privacy-policy" className="text-[#524FD5] hover:underline">Aviso de Privacidad</a>, disponible en{" "}
              <a href="/privacy-policy" className="text-[#524FD5] hover:underline">este enlace</a>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              El usuario acepta dicho tratamiento para fines operativos y de mejora del servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">7. Propiedad Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todo el contenido de la Plataforma (nombre, logotipo, diseño, textos, código, bases de datos y funcionalidades) es propiedad exclusiva de Aurora o cuenta con las licencias correspondientes. Queda prohibida su copia, modificación o distribución sin autorización expresa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">8. Enlaces a Terceros</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora puede contener enlaces a sitios de terceros. No somos responsables del contenido, políticas o prácticas de dichos sitios externos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">9. Modificaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora podrá modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor una vez publicados en la Plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">10. Legislación Aplicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos, y cualquier controversia se someterá a los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponder.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

