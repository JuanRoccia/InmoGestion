import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SearchByCodeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function SearchByCodeDialog({ open, onOpenChange }: SearchByCodeDialogProps) {
    const [code, setCode] = useState("");
    const [searchTrigger, setSearchTrigger] = useState("");
    const [, setLocation] = useLocation();

    const { data: property, isLoading, error, isError } = useQuery({
        queryKey: ["/api/properties/code", searchTrigger],
        queryFn: async ({ queryKey }) => {
            const [_key, codeToSearch] = queryKey;
            if (!codeToSearch) return null;

            const response = await fetch(`/api/properties/code/${codeToSearch}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Propiedad no encontrada");
                }
                throw new Error("Error al buscar la propiedad");
            }
            return response.json();
        },
        enabled: !!searchTrigger,
        retry: false
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            setSearchTrigger(code.trim());
        }
    };

    // Effect to handle successful search
    if (property) {
        onOpenChange(false);
        setLocation(`/properties/${property.id}`);
        // We clear the state after navigation to ensure if they open it again it's fresh
        // but React might unmount/remount so let's be safe.
        setTimeout(() => {
            setSearchTrigger("");
            setCode("");
        }, 100);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Búsqueda por Código</DialogTitle>
                    <DialogDescription>
                        Ingrese el código único de la propiedad (ej. PROP-12345)
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSearch} className="space-y-4 py-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Ingrese el código..."
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="h-11 pl-4 pr-4"
                            autoFocus
                        />
                    </div>

                    {isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error instanceof Error ? error.message : "No se pudo encontrar la propiedad con ese código."}
                            </AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-[#ff2e06] hover:bg-[#e62905] text-white font-bold"
                            disabled={isLoading || !code.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar Propiedad
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
