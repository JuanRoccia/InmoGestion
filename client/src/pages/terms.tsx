import Header from "@/components/header";
import Footer from "@/components/footer-inmo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
                        <p className="text-gray-600">
                            Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            <div className="prose prose-sm max-w-none">
                                {/* Introducción */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introducción y Aceptación</h2>
                                    <p className="text-gray-700 mb-4">
                                        Bienvenido a BuscoInmueble.click. Estos Términos y Condiciones (en adelante, "Términos") 
                                        rigen el uso de nuestra plataforma inmobiliaria y los servicios que ofrecemos a agencias, 
                                        constructoras y buscadores de propiedades en Argentina.
                                    </p>
                                    <p className="text-gray-700 mb-4">
                                        Al acceder, registrarse o utilizar BuscoInmueble.click, usted acepta cumplir con estos 
                                        Términos y nuestra Política de Privacidad. Si no está de acuerdo con estos términos, 
                                        no debe utilizar nuestra plataforma.
                                    </p>
                                    <p className="text-gray-700">
                                        BuscoInmueble.click se reserva el derecho de modificar estos Términos en cualquier momento. 
                                        Las modificaciones entrarán en vigor al publicarse en esta plataforma.
                                    </p>
                                </section>

                                <Separator className="my-8" />

                                {/* Definiciones */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Definiciones</h2>
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>Plataforma:</strong> BuscoInmueble.click, incluyendo el sitio web, aplicaciones móviles y todos los servicios asociados.</p>
                                        <p><strong>Usuario:</strong> Persona que utiliza la Plataforma, ya sea como agencia inmobiliaria, constructora o buscador de propiedades.</p>
                                        <p><strong>Agencia:</strong> Usuario registrado como "inmobiliaria" que publica y gestiona propiedades.</p>
                                        <p><strong>Constructora:</strong> Usuario registrado como "constructora" que publica desarrollos inmobiliarios.</p>
                                        <p><strong>Propiedad:</strong> Inmueble publicado en la Plataforma, incluyendo venta, alquiler o desarrollos.</p>
                                        <p><strong>Contenido:</strong> Toda información, texto, imágenes, datos y materiales disponibles en la Plataforma.</p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Servicios */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Servicios de la Plataforma</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            BuscoInmueble.click ofrece los siguientes servicios:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Publicación y gestión de propiedades para agencias inmobiliarias</li>
                                            <li>Publicación de desarrollos inmobiliarios para constructoras</li>
                                            <li>Búsqueda y filtrado de propiedades para interesados</li>
                                            <li>Mapa interactivo de ubicaciones de propiedades</li>
                                            <li>Dashboard de gestión para agencias y constructoras</li>
                                            <li>Sistema de suscripción con diferentes planes de servicio</li>
                                            <li>Comunicación entre usuarios y agencias</li>
                                        </ul>
                                        <p>
                                            Los servicios están sujetos a disponibilidad y pueden modificarse según las necesidades del mercado.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Registro y Cuentas */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Registro y Cuentas de Usuario</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Para utilizar ciertos servicios de la Plataforma, los usuarios deben registrarse y crear una cuenta. 
                                            El registro requiere:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Proporcionar información veraz, completa y actualizada</li>
                                            <li>Elegir una contraseña segura y mantenerla confidencial</li>
                                            <li>Aceptar estos Términos y la Política de Privacidad</li>
                                            <li>Contar con capacidad legal para contratar (mayores de 18 años)</li>
                                        </ul>
                                        <p>
                                            El usuario es responsable de toda actividad que ocurra en su cuenta y debe notificar 
                                            inmediatamente cualquier uso no autorizado.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Planes de Suscripción */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Planes de Suscripción y Pagos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            BuscoInmueble.click opera bajo un modelo de suscripción mensual con los siguientes planes:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Basic ($29/mes):</strong> Funcionalidades esenciales para pequeñas agencias</li>
                                            <li><strong>Professional ($79/mes):</strong> Funcionalidades avanzadas y soporte prioritario</li>
                                            <li><strong>Enterprise ($149/mes):</strong> Funcionalidad completa con soporte dedicado</li>
                                        </ul>
                                        <p>
                                            Los pagos se procesan a través de Stripe y están sujetos a sus términos y condiciones. 
                                            Las suscripciones se renuevan automáticamente cada mes y pueden cancelarse en cualquier momento.
                                        </p>
                                        <p>
                                            No se realizarán reembolsos por períodos ya pagados, excepto en casos de incumplimiento 
                                            grave del servicio por parte de BuscoInmueble.click.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Responsabilidades del Usuario */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Responsabilidades y Obligaciones del Usuario</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Los usuarios se comprometen a:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Publicar solo información veraz y precisa sobre propiedades</li>
                                            <li>No publicar contenido ilegal, ofensivo o que infrinja derechos de terceros</li>
                                            <li>Respetar la propiedad intelectual y los derechos de autor</li>
                                            <li>No realizar actividades fraudulentas o engañosas</li>
                                            <li>No utilizar la plataforma para fines comerciales no autorizados</li>
                                            <li>Mantener actualizada su información de contacto y perfil</li>
                                            <li>Responder a las consultas de manera profesional y oportuna</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Propiedad Intelectual */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            BuscoInmueble.click y todo su contenido, incluyendo但不限于 el diseño, logos, 
                                            texto, software, imágenes y bases de datos, son propiedad de Hernández & Asociados 
                                            Agencia de Publicidad y Productora de Contenidos y están protegidos por las leyes 
                                            de propiedad intelectual de Argentina.
                                        </p>
                                        <p>
                                            Al publicar contenido en la Plataforma, el usuario otorga a BuscoInmueble.click 
                                            una licencia no exclusiva, gratuita y mundial para usar, reproducir y distribuir 
                                            dicho contenido con fines de operación del servicio.
                                        </p>
                                        <p>
                                            El usuario conserva los derechos sobre su contenido, pero es responsable de 
                                            contar con todos los permisos necesarios para su publicación.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Privacidad y Datos */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Privacidad y Protección de Datos</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            El tratamiento de datos personales se rige por nuestra Política de Privacidad 
                                            y la Ley de Protección de Datos Personales (LPDP) N° 25.326 de Argentina.
                                        </p>
                                        <p>
                                            BuscoInmueble.click se compromete a proteger la información de los usuarios 
                                            y a utilizarla únicamente para los fines descritos en nuestra Política de Privacidad.
                                        </p>
                                        <p>
                                            Los usuarios tienen derecho a acceder, rectificar, actualizar o suprimir 
                                            sus datos personales en cualquier momento.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Limitación de Responsabilidad */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitación de Responsabilidad</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            BuscoInmueble.click actúa como plataforma intermediaria y no es responsable de:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>La veracidad y exactitud de la información publicada por los usuarios</li>
                                            <li>Las transacciones realizadas entre usuarios fuera de la plataforma</li>
                                            <li>Daños directos o indirectos resultantes del uso del servicio</li>
                                            <li>La calidad o estado de las propiedades publicadas</li>
                                            <li>Disputas entre usuarios o con terceros</li>
                                        </ul>
                                        <p>
                                            La responsabilidad máxima de BuscoInmueble.click se limita al monto pagado 
                                            por el usuario en los últimos 3 meses de servicio.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Suspensión y Terminación */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Suspensión y Terminación</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            BuscoInmueble.click puede suspender o terminar cuentas de usuarios en caso de:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Incumplimiento de estos Términos</li>
                                            <li>Actividad fraudulenta o ilegal</li>
                                            <li>Uso abusivo de la plataforma</li>
                                            <li>Violación de derechos de terceros</li>
                                            <li>Falta de pago de suscripciones</li>
                                        </ul>
                                        <p>
                                            El usuario puede terminar su cuenta en cualquier momento mediante el panel 
                                            de control o solicitándolo a soporte.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Ley Aplicable y Jurisdicción */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Ley Aplicable y Jurisdicción</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Estos Términos se rigen por las leyes de la República Argentina. 
                                            Cualquier disputa será resuelta en los tribunales competentes de 
                                            Bahía Blanca, Provincia de Buenos Aires.
                                        </p>
                                        <p>
                                            Para cualquier consulta o controversia, los usuarios pueden contactar 
                                            a nuestro equipo de soporte a través de los canales indicados en 
                                            la sección de contacto.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Contacto */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contacto y Soporte</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Para cualquier pregunta sobre estos Términos y Condiciones, 
                                            puede contactarnos a través de:
                                        </p>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p><strong>Email:</strong> buscoinmuebles@buscoinmuebles.com.ar</p>
                                            <p><strong>Teléfono:</strong> 291 4652552</p>
                                            <p><strong>Dirección:</strong> 8000 Bahía Blanca, Provincia de Buenos Aires</p>
                                        </div>
                                        <p>
                                            Nuestro equipo de soporte está disponible de lunes a viernes 
                                            en horario comercial para responder sus consultas.
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-8 text-sm text-gray-600">
                        <p>© 2025 BuscoInmueble.click - Todos los derechos reservados</p>
                        <p className="mt-2">
                            Estos Términos y Condiciones constituyen un acuerdo legal vinculante 
                            entre usted y BuscoInmueble.click.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}