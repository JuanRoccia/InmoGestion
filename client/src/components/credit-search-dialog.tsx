import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Search } from "lucide-react";
import { useLocation } from "wouter";

interface CreditSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreditSearchDialog({
    open,
    onOpenChange,
}: CreditSearchDialogProps) {
    const [_, setLocation] = useLocation();

    const handleSearch = () => {
        // Navigate to properties with isCreditSuitable filter
        onOpenChange(false);
        setLocation(`/properties?isCreditSuitable=true`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Propiedades Aptas Crédito
                    </DialogTitle>
                    <DialogDescription>
                        Encuentra propiedades que cumplen con los requisitos para créditos hipotecarios.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Al seleccionar esta opción, te mostraremos únicamente las propiedades que han sido verificadas como aptas para crédito bancario.
                    </p>

                    <Button
                        className="w-full bg-[#ff2e06] hover:bg-[#e62905] text-white"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Ver Propiedades Aptas
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
