import Header from "@/components/header";
import Footer from "@/components/footer-inmo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Cookies() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Cookies</h1>
                        <p className="text-gray-600">
                            Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            <div className="prose prose-sm max-w-none">
                                {/* Introducción */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. ¿Qué son las Cookies?</h2>
                                    <p className="text-gray-700 mb-4">
                                        Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
                                        (computadora, móvil, tablet) cuando visita nuestro sitio web. Estos archivos 
                                        permiten que la plataforma recuerde información sobre sus preferencias y 
                                        comportamiento de navegación.
                                    </p>
                                    <p className="text-gray-700">
                                        En BuscoInmueble.click utilizamos cookies para mejorar su experiencia, 
                                        personalizar contenido y asegurar el funcionamiento correcto de nuestros servicios.
                                    </p>
                                </section>

                                <Separator className="my-8" />

                                {/* Tipos de Cookies */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>
                                    <div className="space-y-6 text-gray-700">
                                        
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">🔒 Cookies Esenciales</h3>
                                            <p className="mb-2">Son necesarias para el funcionamiento básico del sitio:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Mantenimiento de sesión de usuario</li>
                                                <li>Gestión de autenticación y seguridad</li>
                                                <li>Procesamiento de pagos y suscripciones</li>
                                                <li>Protección contra fraudes y CSRF</li>
                                                <li>Carga balanceada y rendimiento</li>
                                            </ul>
                                            <p className="text-xs text-blue-700 mt-2">Duración: Sesión o 30 días</p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-semibold text-green-900 mb-2">📊 Cookies de Rendimiento</h3>
                                            <p className="mb-2">Recopilan información sobre el uso del sitio:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Páginas más visitadas y tiempo de permanencia</li>
                                                <li>Tasa de rebote y patrones de navegación</li>
                                                <li>Rendimiento del sitio y velocidad de carga</li>
                                                <li>Dispositivos y navegadores utilizados</li>
                                                <li>Errores y problemas técnicos</li>
                                            </ul>
                                            <p className="text-xs text-green-700 mt-2">Duración: 25 meses</p>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                            <h3 className="font-semibold text-purple-900 mb-2">⚙️ Cookies de Funcionalidad</h3>
                                            <p className="mb-2">Mejoran la experiencia personalizada:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Recordar preferencias de búsqueda</li>
                                                <li>Guardar propiedades favoritas</li>
                                                <li>Mantener configuraciones de idioma</li>
                                                <li>Personalizar contenido mostrado</li>
                                                <li>Gestionar estado del carrito de propiedades</li>
                                            </ul>
                                            <p className="text-xs text-purple-700 mt-2">Duración: 1 año</p>
                                        </div>

                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <h3 className="font-semibold text-orange-900 mb-2">🎯 Cookies de Marketing</h3>
                                            <p className="mb-2">Utilizadas para publicidad y análisis:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Seguimiento de conversiones y campañas</li>
                                                <li>Personalización de anuncios</li>
                                                <li>Remarketing y retargeting</li>
                                                <li>Análisis de eficacia publicitaria</li>
                                                <li>Segmentación de audiencia</li>
                                            </ul>
                                            <p className="text-xs text-orange-700 mt-2">Duración: 90 días a 2 años</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-semibold text-gray-900 mb-2">🌐 Cookies de Terceros</h3>
                                            <p className="mb-2">Instaladas por servicios externos:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li><strong>Google Analytics:</strong> Análisis de tráfico y comportamiento</li>
                                                <li><strong>Stripe:</strong> Procesamiento de pagos seguros</li>
                                                <li><strong>Replit Auth:</strong> Sistema de autenticación</li>
                                                <li><strong>Redes sociales:</strong> Botones de compartir y seguimiento</li>
                                                <li><strong>Mapas:</strong> Google Maps para ubicaciones</li>
                                            </ul>
                                            <p className="text-xs text-gray-700 mt-2">Duración: Variable según proveedor</p>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Tabla de Cookies */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Tabla Detallada de Cookies</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300 text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Propósito</th>
                                                    <th className="border border-gray-300 px-4 py-2 text-left">Duración</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">session_id</td>
                                                    <td className="border border-gray-300 px-4 py-2">Esencial</td>
                                                    <td className="border border-gray-300 px-4 py-2">Mantener sesión activa</td>
                                                    <td className="border border-gray-300 px-4 py-2">Sesión</td>
                                                </tr>
                                                <tr className="bg-gray-50">
                                                    <td className="border border-gray-300 px-4 py-2">auth_token</td>
                                                    <td className="border border-gray-300 px-4 py-2">Esencial</td>
                                                    <td className="border border-gray-300 px-4 py-2">Autenticación de usuario</td>
                                                    <td className="border border-gray-300 px-4 py-2">30 días</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">preferences</td>
                                                    <td className="border border-gray-300 px-4 py-2">Funcionalidad</td>
                                                    <td className="border border-gray-300 px-4 py-2">Preferencias de usuario</td>
                                                    <td className="border border-gray-300 px-4 py-2">1 año</td>
                                                </tr>
                                                <tr className="bg-gray-50">
                                                    <td className="border border-gray-300 px-4 py-2">_ga</td>
                                                    <td className="border border-gray-300 px-4 py-2">Terceros</td>
                                                    <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                                                    <td className="border border-gray-300 px-4 py-2">2 años</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">_gid</td>
                                                    <td className="border border-gray-300 px-4 py-2">Terceros</td>
                                                    <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                                                    <td className="border border-gray-300 px-4 py-2">24 horas</td>
                                                </tr>
                                                <tr className="bg-gray-50">
                                                    <td className="border border-gray-300 px-4 py-2">stripe_session</td>
                                                    <td className="border border-gray-300 px-4 py-2">Esencial</td>
                                                    <td className="border border-gray-300 px-4 py-2">Procesamiento de pagos</td>
                                                    <td className="border border-gray-300 px-4 py-2">Sesión</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2">favorites</td>
                                                    <td className="border border-gray-300 px-4 py-2">Funcionalidad</td>
                                                    <td className="border border-gray-300 px-4 py-2">Propiedades guardadas</td>
                                                    <td className="border border-gray-300 px-4 py-2">6 meses</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Gestión de Cookies */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. ¿Cómo Gestionar las Cookies?</h2>
                                    <div className="space-y-6 text-gray-700">
                                        
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <h3 className="font-semibold text-yellow-900 mb-2">🔧 Configuración en Navegador</h3>
                                            <p className="mb-3">Puede gestionar las cookies a través de la configuración de su navegador:</p>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</p>
                                                <p><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</p>
                                                <p><strong>Safari:</strong> Preferencias → Privacidad → Cookies</p>
                                                <p><strong>Edge:</strong> Configuración → Privacidad y seguridad → Cookies</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">⚙️ Panel de Preferencias</h3>
                                            <p className="mb-3">Nuestro panel de cookies le permite:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Aceptar o rechazar categorías específicas</li>
                                                <li>Ver detalles de cada cookie activa</li>
                                                <li>Retirar consentimiento previamente otorgado</li>
                                                <li>Configurar preferencias duraderas</li>
                                            </ul>
                                        </div>

                                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h3 className="font-semibold text-red-900 mb-2">⚠️ Impacto de Desactivar Cookies</h3>
                                            <p className="mb-3">Si desactiva las cookies, algunas funciones pueden no estar disponibles:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>No podrá mantener sesión iniciada</li>
                                                <li>El carrito de propiedades no funcionará</li>
                                                <li>Las preferencias no se guardarán</li>
                                                <li>El contenido personalizado se limitará</li>
                                                <li>Algunas medidas de seguridad pueden reducirse</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Cookies de Terceros */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies de Terceros y Enlaces Externos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Nuestro sitio web puede contener enlaces a sitios de terceros que tienen 
                                            sus propias políticas de cookies. No somos responsables de las prácticas 
                                            de privacidad de estos sitios externos.
                                        </p>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">Sitios de Terceros Comunes:</h3>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li><strong>Stripe:</strong> Procesamiento de pagos seguros</li>
                                                <li><strong>Google Maps:</strong> Visualización de ubicaciones</li>
                                                <li><strong>Redes Sociales:</strong> Facebook, Instagram, LinkedIn</li>
                                                <li><strong>WhatsApp:</strong> Comunicación directa</li>
                                                <li><strong>YouTube:</strong> Videos de propiedades</li>
                                            </ul>
                                        </div>
                                        
                                        <p>
                                            Le recomendamos revisar las políticas de cookies de estos sitios 
                                            antes de proporcionar información personal.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Actualizaciones */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Actualizaciones de esta Política</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Podemos actualizar esta Política de Cookies para reflejar cambios 
                                            en nuestras prácticas o por requisitos legales.
                                        </p>
                                        <p>
                                            Las modificaciones serán comunicadas a través de:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Notificación en el banner de cookies</li>
                                            <li>Aviso destacado en nuestra plataforma</li>
                                            <li>Actualización de la fecha en esta página</li>
                                            <li>Email a usuarios registrados (para cambios significativos)</li>
                                        </ul>
                                        <p>
                                            Le recomendamos revisar periódicamente esta política para 
                                            mantenerse informado sobre nuestras prácticas de cookies.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Contacto */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contacto y Preguntas</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Si tiene preguntas sobre esta Política de Cookies o necesita 
                                            asistencia para gestionar sus preferencias, puede contactarnos:
                                        </p>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p><strong>Email:</strong> privacy@buscoinmuebles.com.ar</p>
                                            <p><strong>Email general:</strong> buscoinmuebles@buscoinmuebles.com.ar</p>
                                            <p><strong>Teléfono:</strong> 291 4652552</p>
                                            <p><strong>Dirección:</strong> 8000 Bahía Blanca, Provincia de Buenos Aires</p>
                                            <p><strong>Departamento:</strong> Protección de Datos y Privacidad</p>
                                        </div>
                                        <p>
                                            Nuestro equipo de soporte está disponible para ayudarle con 
                                            cualquier consulta relacionada con el uso de cookies en nuestra plataforma.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Información Adicional */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Información Adicional</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">📋 Cumplimiento Normativo</h3>
                                            <p className="text-sm">
                                                Esta política cumple con las siguientes regulaciones:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                                                <li>Reglamento General de Protección de Datos (GDPR) - UE</li>
                                                <li>Ley de Cookies española - Real Decreto 13/2012</li>
                                                <li>California Consumer Privacy Act (CCPA) - California</li>
                                                <li>Ley N° 25.326 de Protección de Datos - Argentina</li>
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-semibold text-green-900 mb-2">🔒 Principios de Privacidad</h3>
                                            <p className="text-sm">
                                                Nuestro uso de cookies se basa en los siguientes principios:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                                                <li>Transparencia en la información recopilada</li>
                                                <li>Consentimiento informado y explícito</li>
                                                <li>Minimización de datos recopilados</li>
                                                <li>Propósito limitado y definido</li>
                                                <li>Seguridad en el procesamiento y almacenamiento</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-8 text-sm text-gray-600">
                        <p>© 2025 BuscoInmueble.click - Todos los derechos reservados</p>
                        <p className="mt-2">
                            Esta política está alineada con las mejores prácticas internacionales 
                            de gestión de cookies y protección de datos.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}