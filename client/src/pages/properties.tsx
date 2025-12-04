import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import PropertyCard from "@/components/property-card";
import SearchFilters from "@/components/search-filters";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Properties() {
  const [filters, setFilters] = useState({
    operationType: "all",
    locationId: "all",
    categoryId: "all",
    limit: 12,
    offset: 0,
  });

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") params.append(key, value.toString());
      });

      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen bg-background pt-28">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Propiedades</h1>
            <p className="text-muted-foreground">Encuentra la propiedad perfecta</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <SearchFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  locations={locations}
                  categories={categories}
                />
              </Card>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property: any) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No se encontraron propiedades</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
