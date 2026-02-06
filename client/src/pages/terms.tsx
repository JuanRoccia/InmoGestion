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
                                {/* 1. Objeto */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Objeto</h2>
                                    <p className="text-gray-700 mb-4">
                                        Los presentes Términos y Condiciones regulan el acceso, suscripción, uso y permanencia de las 
                                        inmobiliarias en el portal web www.buscoinmuebles.click (en adelante, "el Portal"), de propiedad y 
                                        desarrollo de Hernández & Asociados, con domicilio legal en Irigoyen 381 Piso 10 en la ciudad de 
                                        Bahía Blanca, en adelante, "la Empresa". La utilización de los servicios por parte de las inmobiliarias 
                                        implica la aceptación plena y sin reservas de estos términos.
                                    </p>
                                </section>

                                <Separator className="my-8" />

                                {/* 2. Definiciones */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Definiciones</h2>
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>Inmobiliaria:</strong> Toda persona física o jurídica debidamente registrada que accede al Portal para publicar propiedades con fines comerciales.</p>
                                        <p><strong>Usuario final:</strong> Persona que navega el portal en búsqueda de propiedades.</p>
                                        <p><strong>Servicios:</strong> Publicación, promoción y gestión de avisos inmobiliarios dentro del Portal.</p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 3. Requisitos de Registro */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Requisitos de Registro</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Para formar parte del Portal, la Inmobiliaria deberá:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Registrarse mediante el formulario habilitado, aportando datos verídicos y vigentes.</li>
                                            <li>Contar con matrícula habilitante para ejercer la actividad inmobiliaria en su jurisdicción (cuando aplica).</li>
                                            <li>Seleccionar un plan de suscripción mensual vigente.</li>
                                            <li>Aceptar expresamente estos Términos y Condiciones.</li>
                                        </ul>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 4. Planes de Publicación */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Planes de Publicación</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Las inmobiliarias podrán optar entre los siguientes planes:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li><strong>Plan Económico:</strong> Publicación hasta 15 propiedades activas.</li>
                                            <li><strong>Plan Básico:</strong> Publicación hasta 30 propiedades.</li>
                                            <li><strong>Plan Avanzado:</strong> Publicación hasta 50 propiedades.</li>
                                            <li><strong>Plan Premium:</strong> Publicaciones ilimitada de propiedades.</li>
                                        </ul>
                                        <p>
                                            La Empresa se reserva el derecho de modificar precios, beneficios o límites de cada plan, 
                                            notificando a los suscriptores con al menos 7 días de antelación.
                                        </p>
                                        <p>
                                            Los aumentos serán informados con anticipación, desde el mes de inicio de cobranza de los abonos.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 5. Obligaciones y Conducta */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Obligaciones y Conducta</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            La Inmobiliaria se compromete a:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Publicar únicamente propiedades reales, disponibles y con información veraz y comprobable.</li>
                                            <li>Abstenerse de subir contenido engañoso, discriminatorio, ofensivo o que infrinja derechos de terceros.</li>
                                            <li>Mantener actualizadas las propiedades y dar de baja aquellas ya comercializadas.</li>
                                            <li>Gestionar las consultas de usuarios en tiempo razonable (máximo 72 hs).</li>
                                            <li>Utilizar el Portal de manera diligente y conforme a la ley.</li>
                                        </ul>
                                        <p>
                                            La Empresa podrá revisar, suspender o eliminar publicaciones que no cumplan con estas 
                                            condiciones, sin derecho a reclamo por parte del anunciante.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 6. Propiedad Intelectual */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Propiedad Intelectual</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Todos los derechos de propiedad intelectual del Portal, su diseño, marca, logotipo, software y 
                                            elementos gráficos son propiedad exclusiva de Hernández & Asociados, y no podrán ser utilizados 
                                            sin autorización expresa y por escrito.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 7. Política de Pago y Facturacion */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Política de Pago y Facturación</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            La utilización del Portal implica el pago mensual y por adelantado del abono correspondiente al 
                                            plan contratado.
                                        </p>
                                        <p>
                                            Los pagos se gestionan exclusivamente mediante la plataforma Mercado Pago, a través de la 
                                            modalidad de débito automático, que deberá ser autorizado por la Inmobiliaria al momento de su 
                                            registro.
                                        </p>
                                        <p>
                                            Esta modalidad de pago aplica a todos los planes y servicios ofrecidos en el Portal, sin excepción.
                                        </p>
                                        <p>
                                            La gestión de cobros, notificaciones de vencimiento, actualizaciones de datos de pago, 
                                            procesamiento de débitos y tareas administrativas relacionadas estará a cargo de Hernández & Asociados, 
                                            en su calidad de titular y administrador del Portal.
                                        </p>
                                        <p>
                                            La empresa podrá enviar comunicaciones al correo electrónico registrado para informar sobre:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Avisos de débito programado.</li>
                                            <li>Rechazo de pagos.</li>
                                            <li>Cambios en el plan o monto facturado.</li>
                                            <li>Regularización de abonos en mora.</li>
                                        </ul>
                                        <p>
                                            El abono se renovará automáticamente cada mes, salvo notificación expresa de cancelación por 
                                            parte del suscriptor, enviada con al menos 5 días hábiles de antelación al próximo vencimiento.
                                        </p>
                                        <p>
                                            La falta de pago o rechazo del débito podrá derivar en la suspensión temporal de la cuenta y, si 
                                            persiste, en su baja definitiva.
                                        </p>
                                        <p>
                                            No se realizarán reintegros proporcionales por cancelaciones anticipadas del servicio.
                                        </p>
                                        <p>
                                            La Inmobiliaria es responsable de mantener actualizados sus datos de facturación y asegurar la 
                                            disponibilidad de fondos en la cuenta asociada al débito.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 8. Suspensión y Baja */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Suspensión y Baja</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            La Empresa se reserva el derecho de suspender o eliminar una cuenta inmobiliaria por:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2">
                                            <li>Incumplimiento de estos Términos.</li>
                                            <li>Reportes reiterados de usuarios por mala atención o publicaciones fraudulentas.</li>
                                            <li>Uso indebido del Portal o intento de manipulación del sistema.</li>
                                            <li>Por alguna notificación de parte del Colegio de Martilleros y Corredores Publicos del Partido Judicial de Bahía Blanca.</li>
                                        </ul>
                                        <p>
                                            En caso de suspensión, se notificará a la inmobiliaria mediante correo electrónico.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 9. Limitación de responsabilidades */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitación de responsabilidades</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            La Empresa no garantiza ventas, alquileres ni contactos efectivos. Su función es actuar como 
                                            intermediario digital entre inmobiliarias y usuarios interesados. No se responsabiliza por acuerdos 
                                            entre partes fuera del Portal.
                                        </p>
                                        <p>
                                            Asimismo, Hernández & Asociados no será responsable por interrupciones técnicas, errores del 
                                            sistema o caídas temporales del servicio, aunque se compromete a solucionarlas en el menor 
                                            tiempo posible.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 10. Modificaciones */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Modificaciones</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Estos Términos podrán ser actualizados en cualquier momento por la Empresa. Toda modificación 
                                            será comunicada vía correo electrónico a los usuarios activos con al menos 7 días de antelación.
                                        </p>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* 11. Jurisdicción y Ley Aplicable */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Jurisdicción y Ley Aplicable</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Para cualquier controversia derivada del uso del Portal, las partes se someten a la jurisdicción de 
                                            los tribunales ordinarios de la ciudad de Bahía Blanca, renunciando a cualquier otro fuero que 
                                            pudiera corresponder.
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