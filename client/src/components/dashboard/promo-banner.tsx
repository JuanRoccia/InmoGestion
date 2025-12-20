import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PromoBanner() {
    return (
        <Card className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-sm mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                PREMIUM
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl font-bold text-center text-red-800 uppercase tracking-wide">
                    Beneficios de Lanzamiento
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base text-gray-700">
                <p className="font-medium text-center max-w-4xl mx-auto">
                    En Buscoinmuebles estamos iniciando una nueva etapa y queremos premiar a las inmobiliarias que
                    nos acompañen desde el comienzo. Por eso, hemos diseñado un conjunto de beneficios exclusivos
                    para quienes se registren durante los meses de Febrero y Marzo del 2026.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/60 p-4 rounded-lg border border-red-100">
                        <h3 className="font-bold text-red-700 mb-2 border-b border-red-100 pb-1">Planes de suscripción</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>
                                <span className="font-semibold">Planes Económico y/o Básico:</span> Obtendrán un mes bonificado (Abril).
                            </li>
                            <li>
                                <span className="font-semibold">Planes Avanzado y/o Premium:</span> Obtendrán 2 meses bonificados (Abril – Mayo) y además el importe del plan elegido se le mantendrá hasta el mes de Diciembre 2026.
                            </li>
                            <li>
                                <span className="font-semibold">Plan Elite:</span> Obtendrán 3 meses bonificados (Abril – Mayo - Junio) y además el importe del plan elegido se le mantendrá hasta el mes de Marzo 2027.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/60 p-4 rounded-lg border border-red-100">
                        <h3 className="font-bold text-red-700 mb-2 border-b border-red-100 pb-1">Sección Propiedades Destacadas</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>
                                Para quienes contraten los Espacios Visibles en la sección de Propiedades Destacadas accederán a una bonificación exclusiva: <span className="font-semibold">Abril y Mayo completamente bonificados.</span>
                            </li>
                            <li className="text-muted-foreground italic">
                                Disponibles solo seis espacios visibles por sección.
                            </li>
                        </ul>

                        <div className="mt-4 pt-3 border-t border-red-100">
                            <h3 className="font-bold text-red-700 mb-1 text-sm">Vigencia del contrato</h3>
                            <p className="text-xs">
                                Hasta diciembre de 2026. Solo inmobiliarias registradas podrán acceder a los beneficios de lanzamiento y publicación anticipada.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-100/50 p-4 rounded-lg mt-4">
                    <h3 className="font-bold text-center text-red-800 mb-3 uppercase text-sm">Cronograma de Lanzamiento</h3>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center">
                        <div>
                            <span className="block font-bold text-red-600">Fecha límite beneficios</span>
                            00 de Febrero del 2026
                        </div>
                        <div className="hidden md:block h-8 w-px bg-red-300"></div>
                        <div>
                            <span className="block font-bold text-red-600">Inicio carga propiedades</span>
                            Al registrarse y elegir plan
                        </div>
                        <div className="hidden md:block h-8 w-px bg-red-300"></div>
                        <div>
                            <span className="block font-bold text-red-600">Lanzamiento del Portal</span>
                            Sábado 0 / Domingo 0 de Abril del 2026
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
