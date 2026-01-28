import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import PropertyDetail from "./property-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PropertyPreviewPage() {
    const [propertyData, setPropertyData] = useState<any>(null);
    const [_, setLocation] = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const savedData = localStorage.getItem("draft_property");
        if (!savedData) {
            toast({
                title: "No hay vista previa disponible",
                description: "Regresa al formulario para crear una propiedad.",
                variant: "destructive",
            });
            setLocation("/properties"); // Or back to form if we had a route for it
            return;
        }
        try {
            setPropertyData(JSON.parse(savedData));
        } catch (e) {
            console.error("Error parsing draft property", e);
        }
    }, [setLocation, toast]);

    const handleEdit = () => {
        // Navigate back to form? 
        // Ideally we assume the form restores from localStorage or we pass state.
        // For now, let's assume the user navigates back manually or we route to a dedicated create page.
        // Since the form is likely on a modal or a specific route, let's go back to previous history or specific route.
        window.history.back();
    };

    const handleContinue = () => {
        // Navigate to subscribe or registration completion
        // Given the user flow context: "guiarlo a terminar el registro completo y luego elegir una suscripcion"
        // We should probably check their auth status. 
        // For now, let's route to /subscribe as requested in the "future flow" description, 
        // or maybe an intermediate "Finish Registration" page if that exists.
        // The prompt says: "luego lo siuiente seria guiarlo a terminar el registro completo y luego elegir una suscripcion"
        // Let's send to /subscribe for now, as that's often the gateway.
        setLocation("/subscribe");
    };

    if (!propertyData) return <div>Cargando vista previa...</div>;

    return (
        <div className="relative">
            {/* Top Banner */}
            <div className="bg-primary/10 border-b border-primary/20 p-4 sticky top-[72px] z-40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <h2 className="font-semibold text-primary">Vista Previa de la Propiedad</h2>
                        <p className="text-sm text-muted-foreground">Así es como verán los interesados tu propiedad.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleEdit}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                        <Button onClick={handleContinue}>
                            Continuar Publicación
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Property Detail Component reusing the logic */}
            <PropertyDetail initialData={propertyData} />
        </div>
    );
}
