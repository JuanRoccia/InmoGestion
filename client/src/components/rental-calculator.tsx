import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Calculator, X } from "lucide-react";
import { INDICES, IndexType, calculateRentAdjustment, formatCurrency, CalculationResult } from "@/lib/calculator-utils";

interface RentalCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RentalCalculator({ isOpen, onClose }: RentalCalculatorProps) {
    const [initialRent, setInitialRent] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [frequency, setFrequency] = useState<number>(12);
    const [selectedIndex, setSelectedIndex] = useState<IndexType>("ICL");
    const [result, setResult] = useState<CalculationResult | null>(null);

    const handleCalculate = () => {
        if (!initialRent || !startDate) return;

        const rentValue = parseFloat(initialRent.replace(/[^0-9]/g, ""));
        if (isNaN(rentValue)) return;

        const calcResult = calculateRentAdjustment(rentValue, startDate, frequency, selectedIndex);
        setResult(calcResult);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden gap-0 border-none shadow-2xl">
                <div className="p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#ff2e06] uppercase tracking-wider inline-block border-b-2 border-dotted border-[#ff2e06] pb-1">
                            CALCULADORA
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Initial Rent Input */}
                        <div className="space-y-2">
                            <Label className="text-[#ff2e06] font-semibold">Valor inicial del alquiler</Label>
                            <Input
                                type="number"
                                placeholder="Ej: 100.000"
                                value={initialRent}
                                onChange={(e) => setInitialRent(e.target.value)}
                                className="bg-gray-100 border-none h-12 text-lg focus-visible:ring-[#ff2e06]"
                            />
                        </div>

                        {/* Start Date Picker */}
                        <div className="space-y-2">
                            <Label className="text-[#ff2e06] font-semibold">Fecha de inicio de contrato</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-12 bg-gray-100 border-none hover:bg-gray-200",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Frequency Selection */}
                        <div className="space-y-2">
                            <Label className="text-[#ff2e06] font-semibold">Cada cuanto se actualiza (meses)</Label>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setFrequency(num)}
                                        className={cn(
                                            "w-10 h-10 rounded-md flex items-center justify-center transition-all text-sm font-medium",
                                            frequency === num
                                                ? "bg-[#ff2e06]/10 text-[#ff2e06] ring-2 ring-[#ff2e06] ring-offset-1"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Index Selection */}
                        <div className="space-y-2">
                            <Label className="text-[#ff2e06] font-semibold">Índice de actualización</Label>
                            <div className="flex flex-wrap gap-2">
                                {INDICES.map((idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedIndex(idx)}
                                        className={cn(
                                            "px-4 py-2 rounded-md transition-all text-sm font-medium",
                                            selectedIndex === idx
                                                ? "bg-[#ff2e06]/10 text-[#ff2e06] ring-2 ring-[#ff2e06] ring-offset-1"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {idx}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">Índice de Contratos de Locación</p>
                        </div>

                        {/* Calculate Button */}
                        <Button
                            onClick={handleCalculate}
                            className="w-full h-12 bg-[#ff2e06] hover:bg-[#e62905] text-white font-bold text-lg rounded-lg shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]"
                        >
                            CALCULAR
                        </Button>

                        {/* Results Display */}
                        {result && (
                            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100 animate-in fade-in slide-in-from-bottom-4">
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-[#ff2e06] font-medium">Nuevo valor del alquiler</p>
                                    <p className="text-3xl font-bold text-[#ff2e06]">{formatCurrency(result.newAmount)}</p>
                                    <div className="flex justify-center gap-4 text-sm text-gray-600">
                                        <span>Anterior: {formatCurrency(result.oldAmount)}</span>
                                        <span className="text-green-600 font-bold">+{result.percentage}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{result.details}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
