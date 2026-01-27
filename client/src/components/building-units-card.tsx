import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, ArrowRight } from "lucide-react";
import BuildingUnitsTable from "./building-units-table";
import PropertyForm from "./property-form";

// Simplify property form for unit creation - recursive component interaction
// To avoid circular dependency cycles, we'll create a simplified internal form or just reuse PropertyForm but passed carefully
// Actually, PropertyForm is default export. Let's try importing it. If circular dep issues, we might need a separate UnitForm.

interface BuildingUnitsCardProps {
    buildingId: string;
    agencyId: string; // Passed to ensure unit carries same agency
}

export default function BuildingUnitsCard({ buildingId, agencyId }: BuildingUnitsCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: units = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/properties", buildingId, "units"],
        queryFn: async () => {
            const response = await fetch(`/api/properties/${buildingId}/units`);
            if (!response.ok) throw new Error('Failed to fetch units');
            return response.json();
        },
    });

    const handleUnitSuccess = () => {
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["/api/properties", buildingId, "units"] });
        toast({
            title: "Unidad creada",
            description: "La unidad se ha agregado al edificio correctamente.",
        });
    };

    // Prepare minimal "mock" property object for the form to know it's a unit creation
    // We pass parentPropertyId via a special prop or just handle it inside the form
    // PropertyForm needs to handle parentPropertyId prop passed down.

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-primary mr-2" />
                        <h3 className="text-lg font-semibold">Unidades del Edificio</h3>
                        <span className="ml-2 text-sm text-muted-foreground">({units.length})</span>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Unidad
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Nueva Unidad</DialogTitle>
                            </DialogHeader>

                            {/* Reuse PropertyForm but contextually for a Unit */}
                            <div className="mt-4">
                                {/* 
                  We need to pass special props to PropertyForm to preset it as a unit.
                  We'll modify PropertyForm to accept `parentId` prop.
                */}
                                <PropertyForm
                                    onSuccess={handleUnitSuccess}
                                    onCancel={() => setIsDialogOpen(false)}
                                    agency={{ id: agencyId, type: 'constructora' }} // Simplify: inherit constructora type usually
                                    parentId={buildingId} // New prop we need to add to PropertyForm
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Cargando unidades...</div>
                ) : units.length > 0 ? (
                    <BuildingUnitsTable units={units} />
                ) : (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">No hay unidades cargadas en este edificio.</p>
                        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                            Agregar primera unidad
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
