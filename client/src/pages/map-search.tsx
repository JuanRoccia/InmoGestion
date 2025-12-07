import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Loader2 } from "lucide-react";
import SearchFilters from "@/components/search-filters";
import PropertiesMap from "@/components/properties-map";
import Header from "@/components/header";
import FooterInmo from "@/components/footer-inmo";

export default function MapSearch() {
    const searchString = useSearch();
    const [filters, setFilters] = useState({
        operationType: "all",
        locationId: "all",
        categoryId: "all",
        limit: 50, // Get more properties for map
        offset: 0,
    });

    // Sync state with URL params
    useEffect(() => {
        const params = new URLSearchParams(searchString);
        setFilters({
            operationType: params.get("operationType") || "all",
            locationId: params.get("locationId") || "all",
            categoryId: params.get("categoryId") || "all",
            limit: 50,
            offset: 0,
        });
    }, [searchString]);

    // Fetch properties
    const { data: properties = [], isLoading } = useQuery({
        queryKey: ["/api/properties", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "all") {
                    params.append(key, value.toString());
                }
            });
            const res = await fetch(`/api/properties?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch properties");
            return res.json();
        },
    });

    // Fetch data for filters
    const { data: locations = [] } = useQuery<any[]>({ queryKey: ["/api/locations"] });
    const { data: categories = [] } = useQuery<any[]>({ queryKey: ["/api/categories"] });

    const updateFilters = (newFilters: any) => {
        // When filters change via sidebar, update URL to keep sync
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== "all") {
                params.append(key, value.toString());
            }
        });
        window.history.pushState(null, "", `/mapa?${params.toString()}`);
        setFilters(newFilters);
    };

    const clearFilters = () => {
        window.history.pushState(null, "", "/mapa");
        setFilters({
            operationType: "all",
            locationId: "all",
            categoryId: "all",
            limit: 50,
            offset: 0,
        });
    };

    // Determine focused location
    const selectedLocation = locations.find(l => l.id === filters.locationId);
    let focusedLocation = null;

    if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
        const lat = parseFloat(selectedLocation.latitude);
        const lng = parseFloat(selectedLocation.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            focusedLocation = { lat, lng, zoom: 13 };
        }
    }


    return (
        <div className="min-h-screen flex flex-col pt-24">
            <Header />

            <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
                {/* Sidebar Filters - Desktop */}
                <aside className="w-full md:w-[350px] bg-white border-r p-4 overflow-y-auto z-10 shadow-lg flex-shrink-0">
                    <SearchFilters
                        filters={filters}
                        onFiltersChange={updateFilters}
                        locations={locations}
                        categories={categories}
                        onApply={() => { }}
                    />
                </aside>

                {/* Map Area */}
                <div className="flex-1 relative bg-gray-100">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <PropertiesMap
                            properties={properties}
                            focusedLocation={focusedLocation}
                        />
                    )}

                    {/* Mobile Filter Toggle could go here if needed */}
                </div>
            </main>
            <FooterInmo />
        </div>
    );
}
