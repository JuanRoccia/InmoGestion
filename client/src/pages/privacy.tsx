import Header from "@/components/header";
import Footer from "@/components/footer-inmo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
                        <p className="text-gray-600">
                            Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            <div className="prose prose-sm max-w-none">
                                {/* Introducción */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introducción y Compromiso</h2>
                                    <p className="text-gray-700 mb-4">
                                        En BuscoInmueble.click, nos comprometemos a proteger y respetar su privacidad. 
                                        Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos 
                                        y protegemos su información personal de acuerdo con la Ley de Protección de 
                                        Datos Personales N° 25.326 de Argentina y las mejores prácticas internacionales.
                                    </p>
                                    <p className="text-gray-700">
                                        Al utilizar nuestra plataforma, usted acepta las prácticas descritas en esta 
                                        política. Le recomendamos leerla detenidamente y contactarnos si tiene alguna pregunta.
                                    </p>
                                </section>

                                <Separator className="my-8" />

                                {/* Datos Recopilados */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Datos Personales que Recopilamos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Recopilamos diferentes tipos de información según su rol en la plataforma:
                                        </p>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">Para Agencias y Constructoras:</h3>
                                            <ul className="list-disc pl-6 space-y-1">
                                                <li>Nombre completo y razón social</li>
                                                <li>Datos de contacto (email, teléfono, dirección)</li>
                                                <li>Información comercial y profesional</li>
                                                <li>Datos de facturación y pagos</li>
                                                <li>Credenciales de acceso y autenticación</li>
                                                <li>Información sobre propiedades publicadas</li>
                                            </ul>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">Para Buscadores de Propiedades:</h3>
                                            <ul className="list-disc pl-6 space-y-1">
                                                <li>Nombre y datos de contacto</li>
                                                <li>Preferencias de búsqueda</li>
                                                <li>Historial de navegación y propiedades vistas</li>
                                                <li>Información de registro y perfil</li>
                                                <li>Comunicaciones con agencias</li>
                                            </ul>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">Datos Automáticos:</h3>
                                            <ul className="list-disc pl-6 space-y-1">
                                                <li>Dirección IP y datos de conexión</li>
                                                <li>Tipo de navegador y dispositivo</li>
                                                <li>Páginas visitadas y tiempo de navegación</li>
                                                <li>Cookies y datos de análisis</li>
                                                <li>Información geográfica aproximada</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Finalidad del Tratamiento */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Finalidad del Tratamiento de Datos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Utilizamos sus datos personales para las siguientes finalidades:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Prestación del servicio:</strong> Gestionar su cuenta y proporcionar acceso a la plataforma</li>
                                            <li><strong>Comunicación:</strong> Enviar notificaciones, actualizaciones y responder consultas</li>
                                            <li><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma para optimizar funcionalidades</li>
                                            <li><strong>Marketing:</strong> Enviar información relevante sobre nuestros servicios (con su consentimiento)</li>
                                            <li><strong>Seguridad:</strong> Prevenir fraudes y proteger la integridad de la plataforma</li>
                                            <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
                                            <li><strong>Facturación:</strong> Gestionar pagos y suscripciones</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Base Legal */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Base Legal del Tratamiento</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Nuestro tratamiento de datos se basa en las siguientes fundamentaciones legales:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Consentimiento:</strong> Su aceptación explícita al registrarse y utilizar nuestros servicios</li>
                                            <li><strong>Contrato:</strong> Ejecución del contrato de servicios que nos vincula</li>
                                            <li><strong>Obligación legal:</strong> Cumplimiento de leyes y regulaciones vigentes</li>
                                            <li><strong>Interés legítimo:</strong> Intereses comerciales legítimos que no violen sus derechos</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Cookies */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies y Tecnologías Similares</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Utilizamos cookies y tecnologías similares para mejorar su experiencia:
                                        </p>
                                        
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold mb-2">Tipos de Cookies:</h3>
                                            <ul className="list-disc pl-6 space-y-1">
                                                <li><strong>Esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                                                <li><strong>De rendimiento:</strong> Recopilan información sobre el uso del sitio</li>
                                                <li><strong>De funcionalidad:</strong> Recuerdan sus preferencias y configuraciones</li>
                                                <li><strong>De marketing:</strong> Utilizadas para personalizar contenido y publicidad</li>
                                            </ul>
                                        </div>
                                        
                                        <p>
                                            Puede gestionar las cookies a través de la configuración de su navegador 
                                            o nuestro panel de preferencias de cookies.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Conservación de Datos */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Plazos de Conservación de Datos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Conservamos sus datos personales durante los siguientes períodos:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Datos de cuenta:</strong> Mientras mantenga su cuenta activa</li>
                                            <li><strong>Datos de transacciones:</strong> 5 años para fines fiscales y legales</li>
                                            <li><strong>Datos de comunicación:</strong> 2 años desde la última interacción</li>
                                            <li><strong>Datos analíticos:</strong> 25 meses para análisis de tendencias</li>
                                            <li><strong>Datos eliminados:</strong> 30 días en copia de seguridad</li>
                                        </ul>
                                        <p>
                                            Transcurridos estos plazos, procederemos a eliminar los datos de forma segura 
                                            y definitiva, salvo obligación legal de conservación.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Derechos del Usuario */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Derechos de los Titulares de Datos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Como titular de datos personales, usted tiene los siguientes derechos:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Acceso:</strong> Solicitar información sobre sus datos personales</li>
                                            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                                            <li><strong>Actualización:</strong> Mantener sus datos al día</li>
                                            <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos</li>
                                            <li><strong>Limitación:</strong> Restringir el tratamiento de sus datos</li>
                                            <li><strong>Portabilidad:</strong> Transferir sus datos a otro servicio</li>
                                            <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                                            <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
                                        </ul>
                                        <p>
                                            Para ejercer estos derechos, puede contactarnos a través de los canales 
                                            indicados en la sección de contacto de esta política.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Seguridad */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Medidas de Seguridad</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Implementamos medidas técnicas y organizativas robustas para proteger sus datos:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Encriptación de datos en tránsito y en reposo</li>
                                            <li>Control de acceso basado en roles y autenticación multifactor</li>
                                            <li>Monitoreo constante de seguridad y detección de intrusiones</li>
                                            <li>Backups regulares y planes de recuperación de desastres</li>
                                            <li>Auditorías periódicas de seguridad y cumplimiento</li>
                                            <li>Capacitación continua del equipo en protección de datos</li>
                                        </ul>
                                        <p>
                                            A pesar de estas medidas, ninguna transmisión por Internet es 100% segura, 
                                            por lo que no podemos garantizar una seguridad absoluta.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Compartición de Datos */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Compartición de Datos con Terceros</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Solo compartimos sus datos personales en las siguientes circunstancias:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Proveedores de servicios:</strong> Stripe (pagos), Replit (autenticación), hosting</li>
                                            <li><strong>Requisitos legales:</strong> Autoridades gubernamentales y judiciales</li>
                                            <li><strong>Transferencia de negocio:</strong> En caso de fusión, adquisición o venta</li>
                                            <li><strong>Consentimiento explícito:</strong> Cuando usted autoriza la compartición</li>
                                        </ul>
                                        <p>
                                            Todos nuestros proveedores están sujetos a acuerdos de confidencialidad 
                                            y cumplen con estándares de protección de datos similares a los nuestros.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Transferencias Internacionales */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Transferencias Internacionales de Datos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Algunos de nuestros proveedores de servicios están ubicados fuera de Argentina. 
                                            En estos casos, nos aseguramos de que:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Los proveedores cumplan con estándares de protección adecuados</li>
                                            <li>Existan cláusulas contractuales tipo aprobadas por la autoridad de control</li>
                                            <li>Se garantice un nivel de protección equivalente al argentino</li>
                                        </ul>
                                        <p>
                                            Las transferencias internacionales se realizan únicamente cuando son 
                                            necesarias para la prestación de nuestros servicios.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Menores de Edad */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Protección de Menores de Edad</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Nuestra plataforma no está dirigida a menores de 18 años. 
                                            No recopilamos intencionalmente información personal de menores.
                                        </p>
                                        <p>
                                            Si descubrimos que hemos recopilado información de un menor, 
                                            procederemos a eliminarla inmediatamente y notificaremos a los padres 
                                            o tutores legales.
                                        </p>
                                        <p>
                                            Los padres o tutores que sospechen que su hijo ha proporcionado 
                                            información personal pueden contactarnos para solicitar su eliminación.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Cambios en la Política */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Modificaciones de esta Política</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Podemos actualizar esta Política de Privacidad periódicamente para reflejar 
                                            cambios en nuestras prácticas o por requisitos legales.
                                        </p>
                                        <p>
                                            Las modificaciones significativas serán comunicadas con al menos 30 días 
                                            de antelación a través de:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Notificación por email a usuarios registrados</li>
                                            <li>Aviso destacado en nuestra plataforma</li>
                                            <li>Publicación en esta misma página con fecha de actualización</li>
                                        </ul>
                                        <p>
                                            El uso continuado de la plataforma después de los cambios constituye 
                                            aceptación de la política modificada.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Contacto y Autoridad de Control */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contacto y Autoridad de Control</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Para ejercer sus derechos, realizar consultas o presentar reclamos 
                                            sobre protección de datos personales, puede contactarnos a través de:
                                        </p>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p><strong>Email de privacidad:</strong> privacy@buscoinmuebles.com.ar</p>
                                            <p><strong>Email general:</strong> buscoinmuebles@buscoinmuebles.com.ar</p>
                                            <p><strong>Teléfono:</strong> 291 4652552</p>
                                            <p><strong>Dirección:</strong> 8000 Bahía Blanca, Provincia de Buenos Aires</p>
                                            <p><strong>Responsable:</strong> Departamento de Protección de Datos</p>
                                        </div>
                                        <p>
                                            También tiene derecho a presentar un reclamo ante la Agencia de 
                                            Acceso a la Información Pública (AAIP), organismo de control de 
                                            protección de datos personales en Argentina.
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-8 text-sm text-gray-600">
                        <p>© 2025 BuscoInmueble.click - Todos los derechos reservados</p>
                        <p className="mt-2">
                            Esta política cumple con la Ley N° 25.326 de Protección de Datos Personales 
                            y las regulaciones internacionales de privacidad.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}