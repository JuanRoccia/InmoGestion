import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

interface SearchByValueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SearchByValueDialog({
    open,
    onOpenChange,
}: SearchByValueDialogProps) {
    const [_, setLocation] = useLocation();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [exactPrice, setExactPrice] = useState("");

    // Clear state when dialog opens/closes
    useEffect(() => {
        if (open) {
            setMinPrice("");
            setMaxPrice("");
            setExactPrice("");
        }
    }, [open]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        // Prioritize exact price if set
        if (exactPrice) {
            params.append("price", exactPrice);
        } else {
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
        }

        // Close dialog and navigate
        onOpenChange(false);
        setLocation(`/properties?${params.toString()}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Búsqueda por Valor</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Price Range */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Rango de Precio</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="number"
                                placeholder="Mínimo"
                                value={minPrice}
                                onChange={(e) => {
                                    setMinPrice(e.target.value);
                                    if (e.target.value) setExactPrice(""); // Clear exact price if range is used
                                }}
                            />
                            <Input
                                type="number"
                                placeholder="Máximo"
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(e.target.value);
                                    if (e.target.value) setExactPrice(""); // Clear exact price if range is used
                                }}
                            />
                        </div>
                        {(minPrice || maxPrice) && (
                            <p className="text-xs text-muted-foreground">
                                Se buscarán propiedades entre {minPrice || "0"} y {maxPrice || "∞"}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                O
                            </span>
                        </div>
                    </div>

                    {/* Exact Price */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Precio Exacto</Label>
                        <Input
                            type="number"
                            placeholder="Ingrese precio exacto"
                            value={exactPrice}
                            onChange={(e) => {
                                setExactPrice(e.target.value);
                                if (e.target.value) {
                                    setMinPrice(""); // Clear range if exact is used
                                    setMaxPrice("");
                                }
                            }}
                        />
                        {exactPrice && (
                            <p className="text-xs text-muted-foreground">
                                Se buscarán propiedades con precio exacto de {exactPrice}
                            </p>
                        )}
                    </div>

                    <Button
                        className="w-full bg-[#ff2e06] hover:bg-[#e62905] text-white"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Buscar Propiedades
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
