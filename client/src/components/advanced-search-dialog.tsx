import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchFilters from "@/components/search-filters";
import { useLocation } from "wouter";

interface AdvancedSearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialFilters: {
        operationType: string;
        locationId: string;
        categoryId: string;
    };
    locations: any[];
    categories: any[];
}

export default function AdvancedSearchDialog({
    open,
    onOpenChange,
    initialFilters,
    locations,
    categories,
}: AdvancedSearchDialogProps) {
    const [_, setLocation] = useLocation();
    const [filters, setFilters] = useState({
        ...initialFilters,
        limit: 12,
        offset: 0,
    });

    // Sync initial filters when dialog opens
    useEffect(() => {
        if (open) {
            setFilters(prev => ({ ...prev, ...initialFilters }));
        }
    }, [open, initialFilters]);

    const handleApply = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all") {
                params.append(key, value.toString());
            }
        });

        // Close dialog and navigate
        onOpenChange(false);
        setLocation(`/properties?${params.toString()}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Búsqueda Avanzada</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <SearchFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        locations={locations}
                        categories={categories}
                        onApply={handleApply}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
