"use client"

import { Header } from "@/components/header"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-[#0F172A] pt-12">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-12 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#524FD5] mb-4">
              Aviso de Privacidad – Aurora
            </h1>
            <p className="text-gray-600 text-sm">
              Última actualización: 19 OCTUBRE 2025
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">1. Identidad y Contacto del Responsable</h2>
            <p className="text-gray-700 leading-relaxed">
              El presente Aviso de Privacidad corresponde a Aurora, una iniciativa digital accesible desde{" "}
              <a href="https://weareaurora.tech" className="text-[#524FD5] hover:underline" target="_blank" rel="noopener noreferrer">
                https://weareaurora.tech
              </a>{" "}
              (en adelante, "la Plataforma"), dedicada a conectar estudiantes de inglés con adultos mayores para promover la práctica del idioma y la convivencia intergeneracional.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Aurora actualmente no opera como persona moral constituida, sino como proyecto en desarrollo.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Para cualquier duda o solicitud relacionada con la protección de datos personales, puedes comunicarte al correo:
            </p>
            <p className="text-gray-700 leading-relaxed">
              📩 <a href="mailto:weareaurora.tech@gmail.com" className="text-[#524FD5] hover:underline">weareaurora.tech@gmail.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">2. Datos Personales que se Recaban</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora podrá recopilar los siguientes datos personales de los usuarios (estudiantes y adultos mayores):
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Nombre y apellido</li>
              <li>Edad o rango de edad</li>
              <li>Correo electrónico</li>
              <li>País o ciudad de residencia</li>
              <li>Nivel de inglés o idioma nativo</li>
              <li>Preferencias de horario o intereses</li>
              <li>Imagen, voz o video (en caso de que se utilicen herramientas de videollamada o grabación)</li>
              <li>Información técnica (dirección IP, dispositivo, navegador, cookies)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed font-semibold">
              Aurora no solicita ni almacena información financiera ni médica.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">3. Finalidades del Tratamiento</h2>
            <p className="text-gray-700 leading-relaxed">
              Los datos personales son utilizados para los siguientes fines:
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-gray-700 leading-relaxed font-semibold mb-2">Finalidades principales:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Permitir el registro y acceso a la Plataforma.</li>
                  <li>Facilitar la conexión entre estudiantes y adultos mayores.</li>
                  <li>Administrar y mejorar la experiencia de uso.</li>
                  <li>Supervisar el cumplimiento de las normas de convivencia.</li>
                </ul>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed font-semibold mb-2">Finalidades secundarias (opcionales):</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Enviar notificaciones sobre mejoras o novedades del proyecto.</li>
                  <li>Realizar encuestas o análisis de satisfacción.</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              El usuario podrá oponerse a las finalidades secundarias enviando un correo a{" "}
              <a href="mailto:contact@weareaurora.tech" className="text-[#524FD5] hover:underline">contact@weareaurora.tech</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">4. Transferencia de Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora no comparte, vende ni renta datos personales a terceros.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Sin embargo, podrá utilizar proveedores tecnológicos (como servicios de hosting o videollamada) que procesen los datos únicamente con fines operativos y bajo medidas de seguridad adecuadas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">5. Grabaciones y Uso de Imagen</h2>
            <p className="text-gray-700 leading-relaxed">
              En caso de que se graben sesiones o videollamadas, el usuario será notificado previamente y podrá otorgar o negar su consentimiento.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Las grabaciones se utilizarán únicamente con fines de mejora, supervisión o evaluación interna y se eliminarán en un plazo razonable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">6. Derechos ARCO</h2>
            <p className="text-gray-700 leading-relaxed">
              El usuario puede ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO), así como revocar su consentimiento para el tratamiento de sus datos, enviando una solicitud al correo:
            </p>
            <p className="text-gray-700 leading-relaxed">
              📧 <a href="mailto:contact@weareaurora.tech" className="text-[#524FD5] hover:underline">contact@weareaurora.tech</a>
            </p>
            <p className="text-gray-700 leading-relaxed">
              Aurora responderá en un plazo máximo de 20 días hábiles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">7. Seguridad de la Información</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora aplica medidas razonables de seguridad técnica y administrativa para proteger los datos personales contra pérdida, alteración o acceso no autorizado.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Sin embargo, el usuario reconoce que ningún sistema es completamente infalible y utiliza la Plataforma bajo su propio riesgo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">8. Conservación de los Datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir con las finalidades descritas o hasta que el usuario solicite su eliminación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">9. Modificaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Aurora podrá actualizar este Aviso de Privacidad cuando sea necesario.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Las modificaciones se publicarán en{" "}
              <a href="https://weareaurora.tech" className="text-[#524FD5] hover:underline" target="_blank" rel="noopener noreferrer">
                https://weareaurora.tech
              </a>{" "}
              con la fecha de actualización correspondiente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F172A]">10. Aceptación</h2>
            <p className="text-gray-700 leading-relaxed">
              Al registrarse o utilizar la Plataforma, el usuario reconoce haber leído y aceptado este Aviso de Privacidad.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

