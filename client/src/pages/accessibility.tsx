import Header from "@/components/header";
import Footer from "@/components/footer-inmo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Accessibility() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Accesibilidad</h1>
                        <p className="text-gray-600">
                            Última actualización: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            <div className="prose prose-sm max-w-none">
                                {/* Introducción */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Nuestro Compromiso con la Accesibilidad</h2>
                                    <p className="text-gray-700 mb-4">
                                        En BuscoInmueble.click, estamos comprometidos con garantizar que nuestra plataforma 
                                        sea accesible para todas las personas, independientemente de sus capacidades o 
                                        discapacidades. Trabajamos continuamente para mejorar la experiencia de usuario 
                                        y cumplir con los estándares internacionales de accesibilidad web.
                                    </p>
                                    <p className="text-gray-700">
                                        Creemos que todos deben tener igualdad de oportunidades para acceder a información 
                                        sobre propiedades y servicios inmobiliarios en Argentina.
                                    </p>
                                </section>

                                <Separator className="my-8" />

                                {/* Estándares WCAG */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Estándares de Accesibilidad</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Nuestra plataforma se esfuerza por cumplir con las siguientes pautas y estándares:
                                        </p>
                                        
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">🌐 WCAG 2.1 AA</h3>
                                            <p className="text-sm mb-2">
                                                Web Content Accessibility Guidelines 2.1 Nivel AA:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Perceptible: Información presentada de forma detectable</li>
                                                <li>Operable: Interfaz navegable y operable</li>
                                                <li>Comprensible: Información y operación comprensibles</li>
                                                <li>Robusto: Compatible con tecnologías asistenciales</li>
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-semibold text-green-900 mb-2">📱 Diseño Responsive</h3>
                                            <p className="text-sm mb-2">
                                                Adaptación a diferentes dispositivos y tamaños de pantalla:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Optimizado para móviles y tablets</li>
                                                <li>Zoom hasta 200% sin pérdida de funcionalidad</li>
                                                <li>Orientación vertical y horizontal</li>
                                                <li>Compatibilidad con lectores de pantalla</li>
                                            </ul>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                            <h3 className="font-semibold text-purple-900 mb-2">🎨 Contraste y Legibilidad</h3>
                                            <p className="text-sm mb-2">
                                                Estándares visuales para mejor legibilidad:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Relación de contraste mínima 4.5:1 en texto normal</li>
                                                <li>3:1 en texto grande (18pt+ o 14pt+ negrita)</li>
                                                <li>Fuentes legibles y tamaños adecuados</li>
                                                <li>Espaciado suficiente entre elementos</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Características de Accesibilidad */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Características de Accesibilidad Implementadas</h2>
                                    <div className="space-y-6 text-gray-700">
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold mb-2">🔤 Navegación por Teclado</h3>
                                                <ul className="list-disc pl-6 space-y-1 text-sm">
                                                    <li>Tab order lógico y secuencial</li>
                                                    <li>Focus visible en todos elementos interactivos</li>
                                                    <li>Atajos de teclado para funciones principales</li>
                                                    <li>Skip links para saltar al contenido principal</li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold mb-2">🔊 Lectores de Pantalla</h3>
                                                <ul className="list-disc pl-6 space-y-1 text-sm">
                                                    <li>Etiquetas ARIA descriptivas</li>
                                                    <li>Textos alternativos en imágenes</li>
                                                    <li>Estructura semántica HTML5</li>
                                                    <li>Notificaciones de estado y cambios</li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold mb-2">🎯 Contenido Adaptable</h3>
                                                <ul className="list-disc pl-6 space-y-1 text-sm">
                                                    <li>Reordenación de contenido responsive</li>
                                                    <li>Textos escalables sin pérdida de formato</li>
                                                    <li>Información no dependiente solo de color</li>
                                                    <li>Alternativas textuales para contenido visual</li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold mb-2">⏱️ Tiempo y Límites</h3>
                                                <ul className="list-disc pl-6 space-y-1 text-sm">
                                                    <li>Sin timeouts automáticos inesperados</li>
                                                    <li>Control sobre animaciones y movimientos</li>
                                                    <li>Pausa en contenido automático</li>
                                                    <li>Extensión de tiempo cuando es necesario</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Herramientas de Ayuda */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Herramientas de Ayuda Disponibles</h2>
                                    <div className="space-y-6 text-gray-700">
                                        
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <h3 className="font-semibold text-yellow-900 mb-2">🛠️ Herramientas Integradas</h3>
                                            <p className="mb-3">Nuestra plataforma incluye:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Lector de pantalla integrado opcional</li>
                                                <li>Control de tamaño de fuente (A- A A+)</li>
                                                <li>Modo alto contraste</li>
                                                <li>Navegación simplificada</li>
                                                <li>Subtítulos en videos de propiedades</li>
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">🌐 Tecnologías Asistenciales Recomendadas</h3>
                                            <p className="mb-3">Compatibilidad con:</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <strong>Lectores de Pantalla:</strong>
                                                    <ul className="list-disc pl-6 mt-1">
                                                        <li>NVDA (Windows)</li>
                                                        <li>JAWS (Windows)</li>
                                                        <li>VoiceOver (macOS/iOS)</li>
                                                        <li>TalkBack (Android)</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong>Otras Herramientas:</strong>
                                                    <ul className="list-disc pl-6 mt-1">
                                                        <li>Software de reconocimiento de voz</li>
                                                        <li>Ampliadores de pantalla</li>
                                                        <li>Teclados adaptados</li>
                                                        <li>Dispositivos apuntadores alternativos</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Atajos de Teclado */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Atajos de Teclado</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Utilice estos atajos para navegar más eficientemente:
                                        </p>
                                        
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border border-gray-300 px-4 py-2 text-left">Atajo</th>
                                                        <th className="border border-gray-300 px-4 py-2 text-left">Función</th>
                                                        <th className="border border-gray-300 px-4 py-2 text-left">Disponibilidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Tab</td>
                                                        <td className="border border-gray-300 px-4 py-2">Navegar al siguiente elemento</td>
                                                        <td className="border border-gray-300 px-4 py-2">Global</td>
                                                    </tr>
                                                    <tr className="bg-gray-50">
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Shift + Tab</td>
                                                        <td className="border border-gray-300 px-4 py-2">Navegar al elemento anterior</td>
                                                        <td className="border border-gray-300 px-4 py-2">Global</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Enter / Espacio</td>
                                                        <td className="border border-gray-300 px-4 py-2">Activar botones/enlaces</td>
                                                        <td className="border border-gray-300 px-4 py-2">Global</td>
                                                    </tr>
                                                    <tr className="bg-gray-50">
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Alt + 1</td>
                                                        <td className="border border-gray-300 px-4 py-2">Ir al contenido principal</td>
                                                        <td className="border border-gray-300 px-4 py-2">Global</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Alt + 2</td>
                                                        <td className="border border-gray-300 px-4 py-2">Ir al menú de navegación</td>
                                                        <td className="border border-gray-300 px-4 py-2">Global</td>
                                                    </tr>
                                                    <tr className="bg-gray-50">
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Alt + 3</td>
                                                        <td className="border border-gray-300 px-4 py-2">Ir al buscador</td>
                                                        <td className="border border-gray-300 px-4 py-2">Global</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Alt + 4</td>
                                                        <td className="border border-gray-300 px-4 py-2">Ir al mapa de propiedades</td>
                                                        <td className="border border-gray-300 px-4 py-2">Páginas con mapa</td>
                                                    </tr>
                                                    <tr className="bg-gray-50">
                                                        <td className="border border-gray-300 px-4 py-2 font-mono">Esc</td>
                                                        <td className="border border-gray-300 px-4 py-2">Cerrar modales/diálogos</td>
                                                        <td className="border border-gray-300 px-4 py-2">Modales</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Limitaciones Conocidas */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitaciones Conocidas y Plan de Mejora</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            A pesar de nuestros esfuerzos, podemos tener algunas limitaciones:
                                        </p>
                                        
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <h3 className="font-semibold text-orange-900 mb-2">⚠️ Limitaciones Actuales</h3>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Algunos documentos PDF de propiedades pueden no ser completamente accesibles</li>
                                                <li>Videos de terceros pueden no tener subtítulos en tiempo real</li>
                                                <li>Mapas interactivos tienen limitaciones en navegación por teclado</li>
                                                <li>Formularios complejos pueden requerir asistencia adicional</li>
                                            </ul>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-semibold text-green-900 mb-2">📈 Plan de Mejora Continua</h3>
                                            <p className="mb-2">Estamos trabajando en:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Auditorías trimestrales de accesibilidad</li>
                                                <li>Capacitación continua del equipo en WCAG</li>
                                                <li>Pruebas con usuarios con discapacidades</li>
                                                <li>Implementación de nuevas tecnologías asistenciales</li>
                                                <li>Mejora de contraste y legibilidad</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Feedback y Soporte */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Feedback y Soporte de Accesibilidad</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Valoramos su feedback para mejorar nuestra accesibilidad. Si experimenta 
                                            dificultades o tiene sugerencias, por favor contáctenos:
                                        </p>
                                        
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">📞 Canales de Soporte</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p><strong>Email de Accesibilidad:</strong></p>
                                                    <p>accesibilidad@buscoinmuebles.com.ar</p>
                                                    <p className="text-xs text-gray-600 mt-1">Respuesta en 24-48 horas</p>
                                                </div>
                                                <div>
                                                    <p><strong>Teléfono:</strong></p>
                                                    <p>291 4652552</p>
                                                    <p className="text-xs text-gray-600 mt-1">Lunes a viernes, 9:00-18:00</p>
                                                </div>
                                                <div>
                                                    <p><strong>WhatsApp:</strong></p>
                                                    <p>+54 291 4652552</p>
                                                    <p className="text-xs text-gray-600 mt-1">Soporte por texto</p>
                                                </div>
                                                <div>
                                                    <p><strong>Formulario Web:</strong></p>
                                                    <p>Sección Contacto → Accesibilidad</p>
                                                    <p className="text-xs text-gray-600 mt-1">Respuesta en 48 horas</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <h3 className="font-semibold text-yellow-900 mb-2">🔄 Proceso de Reporte</h3>
                                            <ol className="list-decimal pl-6 space-y-1 text-sm">
                                                <li>Reporte el problema describiendo la dificultad encontrada</li>
                                                <li>Indique el navegador, dispositivo y tecnología asistencial utilizada</li>
                                                <li>Adjunte capturas de pantalla si es posible</li>
                                                <li>Recibirá respuesta con plan de acción y timeline</li>
                                                <li>Le mantendremos informado del progreso de la solución</li>
                                            </ol>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Certificaciones y Cumplimiento */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Certificaciones y Cumplimiento Legal</h2>
                                    <div className="space-y-4 text-gray-700">
                                        
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <h3 className="font-semibold text-green-900 mb-2">✅ Cumplimiento Normativo</h3>
                                            <p className="mb-2">Cumplimos con:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Ley N° 26.653 de Accesibilidad en la Información - Argentina</li>
                                                <li>Decreto 779/95 sobre Accesibilidad al Medio Físico</li>
                                                <li>Convención sobre los Derechos de las Personas con Discapacidad - ONU</li>
                                                <li>Sección 508 de la Ley de Rehabilitación - EE.UU.</li>
                                                <li>Directiva de Accesibilidad Web - Unión Europea</li>
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <h3 className="font-semibold text-blue-900 mb-2">🏆 Auditorías y Certificaciones</h3>
                                            <p className="mb-2">Nuestro proceso incluye:</p>
                                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                                <li>Auditorías automáticas con herramientas especializadas</li>
                                                <li>Pruebas manuales con lectores de pantalla</li>
                                                <li>Evaluación por expertos en accesibilidad</li>
                                                <li>Pruebas con usuarios reales con discapacidades</li>
                                                <li>Certificación WCAG 2.1 AA en progreso</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <Separator className="my-8" />

                                {/* Recursos Adicionales */}
                                <section className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Recursos Adicionales de Accesibilidad</h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p>
                                            Para obtener más información sobre accesibilidad web, recomendamos:
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold mb-2">📚 Guías y Estándares</h3>
                                                <ul className="list-disc pl-6 space-y-1 text-sm">
                                                    <li><a href="https://www.w3.org/WAI/WCAG21/quickref/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WCAG 2.1 Quick Reference</a></li>
                                                    <li><a href="https://www.w3.org/WAI/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Web Accessibility Initiative (WAI)</a></li>
                                                    <li><a href="https://webaim.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WebAIM - Accesibilidad Web</a></li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold mb-2">🛠️ Herramientas de Evaluación</h3>
                                                <ul className="list-disc pl-6 space-y-1 text-sm">
                                                    <li><a href="https://wave.webaim.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WAVE - Evaluador de Accesibilidad</a></li>
                                                    <li><a href="https://axe.dev/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">axe - Herramienta de Testing</a></li>
                                                    <li><a href="https://color.adobe.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Adobe Color - Contraste</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-8 text-sm text-gray-600">
                        <p>© 2025 BuscoInmueble.click - Todos los derechos reservados</p>
                        <p className="mt-2">
                            Esta declaración de accesibilidad refleja nuestro compromiso continuo 
                            con la inclusión digital y el acceso igualitario para todos.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}