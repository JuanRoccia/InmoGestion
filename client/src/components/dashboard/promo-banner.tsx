import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PromoBanner() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div role="button" className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-sm mb-8 overflow-hidden relative cursor-pointer hover:shadow-md transition-all rounded-lg group">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                        PREMIUM
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <h2 className="text-xl md:text-2xl font-bold text-red-800 uppercase tracking-wide group-hover:text-red-600 transition-colors">
                            Beneficios de Lanzamiento
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 max-w-3xl line-clamp-2 md:line-clamp-none">
                            En Buscoinmuebles estamos iniciando una nueva etapa y queremos premiar a las inmobiliarias que nos acompañen desde el comienzo.
                        </p>
                        <span className="text-xs font-medium text-red-500 mt-2 block md:hidden">Ver más detalles</span>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold text-red-800 text-center uppercase tracking-wide">
                            Beneficios de Lanzamiento
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Exclusivo para registros en Febrero y Marzo 2026
                        </DialogDescription>
                    </DialogHeader>

                    <Carousel className="w-full max-w-3xl mx-auto">
                        <CarouselContent>
                            {/* Slide 1: Introduction */}
                            <CarouselItem>
                                <div className="p-4 md:p-6 h-[400px] flex flex-col justify-center items-center text-center bg-red-50/50 rounded-lg border border-red-100">
                                    <h3 className="text-xl font-bold text-red-700 mb-4">Una Nueva Etapa</h3>
                                    <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                                        En Buscoinmuebles estamos iniciando una nueva etapa y queremos premiar a las inmobiliarias que
                                        nos acompañen desde el comienzo. Por eso, hemos diseñado un conjunto de beneficios exclusivos
                                        para quienes se registren durante los meses de Febrero y Marzo del 2026.
                                    </p>
                                </div>
                            </CarouselItem>

                            {/* Slide 2: Subscription Plans */}
                            <CarouselItem>
                                <div className="p-4 md:p-6 h-[400px] bg-white rounded-lg border border-red-100 flex flex-col">
                                    <h3 className="text-xl font-bold text-center text-red-700 mb-4 border-b border-red-100 pb-2">
                                        Planes de Suscripción
                                    </h3>
                                    <ScrollArea className="flex-1 pr-4">
                                        <ul className="space-y-4 text-sm md:text-base text-gray-700">
                                            <li className="bg-red-50/50 p-3 rounded-md">
                                                <span className="font-bold text-red-800 block mb-1">Planes Económico y/o Básico</span>
                                                Obtendrán un mes bonificado (Abril).
                                            </li>
                                            <li className="bg-red-50/50 p-3 rounded-md">
                                                <span className="font-bold text-red-800 block mb-1">Planes Avanzado y/o Premium</span>
                                                Obtendrán 2 meses bonificados (Abril – Mayo) y además el importe del plan elegido se le mantendrá hasta el mes de Diciembre 2026.
                                            </li>
                                            <li className="bg-red-50/50 p-3 rounded-md">
                                                <span className="font-bold text-red-800 block mb-1">Plan Elite</span>
                                                Obtendrán 3 meses bonificados (Abril – Mayo - Junio) y además el importe del plan elegido se le mantendrá hasta el mes de Marzo 2027.
                                            </li>
                                        </ul>
                                    </ScrollArea>
                                </div>
                            </CarouselItem>

                            {/* Slide 3: Featured Properties */}
                            <CarouselItem>
                                <div className="p-4 md:p-6 h-[400px] bg-white rounded-lg border border-red-100 flex flex-col">
                                    <h3 className="text-xl font-bold text-center text-red-700 mb-4 border-b border-red-100 pb-2">
                                        Propiedades Destacadas
                                    </h3>
                                    <div className="flex-1 flex flex-col justify-center space-y-6">
                                        <div className="bg-red-50/50 p-4 rounded-md text-center">
                                            <p className="text-gray-700 mb-2">
                                                Para quienes contraten los <span className="font-semibold text-red-600">Espacios Visibles</span> en la sección de Propiedades Destacadas:
                                            </p>
                                            <p className="text-lg font-bold text-red-800">
                                                Abril y Mayo completamente bonificados.
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <Badge variant="outline" className="border-red-200 text-red-600 bg-red-50">
                                                Cupos Limitados
                                            </Badge>
                                            <p className="text-sm text-gray-500 mt-2 italic">
                                                Disponibles solo seis espacios visibles por sección.
                                            </p>
                                        </div>
                                        <div className="border-t border-red-100 pt-3 text-center">
                                            <p className="text-xs font-semibold text-red-700 uppercase mb-1">Vigencia</p>
                                            <p className="text-xs text-gray-600">Hasta diciembre de 2026. Solo inmobiliarias registradas.</p>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>

                            {/* Slide 4: Schedule */}
                            <CarouselItem>
                                <div className="p-4 md:p-6 h-[400px] bg-white rounded-lg border border-red-100 flex flex-col">
                                    <h3 className="text-xl font-bold text-center text-red-700 mb-4 border-b border-red-100 pb-2">
                                        Cronograma de Lanzamiento
                                    </h3>
                                    <div className="flex-1 flex flex-col justify-center space-y-4">
                                        <div className="flex items-center gap-4 bg-red-50/30 p-3 rounded-lg">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">1</div>
                                            <div>
                                                <p className="font-bold text-red-700 text-sm">Fecha límite beneficios</p>
                                                <p className="text-gray-700">00 de Febrero del 2026</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-red-50/30 p-3 rounded-lg">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">2</div>
                                            <div>
                                                <p className="font-bold text-red-700 text-sm">Inicio carga propiedades</p>
                                                <p className="text-gray-700">Al registrarse y elegir plan</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-red-50/30 p-3 rounded-lg">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">3</div>
                                            <div>
                                                <p className="font-bold text-red-700 text-sm">Lanzamiento del Portal</p>
                                                <p className="text-gray-700">Sábado 0 / Domingo 0 de Abril del 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12 border-red-200 text-red-800 hover:bg-red-50" />
                        <CarouselNext className="hidden md:flex -right-12 border-red-200 text-red-800 hover:bg-red-50" />
                        <div className="flex md:hidden justify-center gap-4 mt-4">
                            <CarouselPrevious variant="outline" className="static translate-y-0 border-red-200" />
                            <CarouselNext variant="outline" className="static translate-y-0 border-red-200" />
                        </div>
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog>
    );
}
