import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import PropertyCard from "@/components/property-card";
import SearchFilters from "@/components/search-filters";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FooterInmo from "@/components/footer-inmo";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FeatureGate from "@/components/FeatureGate";
import { useAccessPermissions } from "@/hooks/useAccessPermissions";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 12;

export default function Properties() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const agencyId = params.get("agencyId");

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(() => {
    return {
      operationType: params.get("operationType") || "all",
      locationId: params.get("locationId") || "all",
      categoryId: params.get("categoryId") || "all",
      agencyId: agencyId || "all",
      limit: ITEMS_PER_PAGE,
      offset: 0,
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      price: params.get("price") || "",
      minArea: params.get("minArea") || "",
      maxArea: params.get("maxArea") || "",
      isCreditSuitable: params.get("isCreditSuitable") === "true",
    };
  });

  // Reset to page 1 when filters change (except offset)
  useEffect(() => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, offset: 0 }));
  }, [filters.operationType, filters.locationId, filters.categoryId, filters.agencyId, filters.minPrice, filters.maxPrice, filters.isCreditSuitable]);

  // Update offset when page changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, offset: (currentPage - 1) * ITEMS_PER_PAGE }));
  }, [currentPage]);

  // Fetch agency info if filtering by agencyId
  const { data: agency } = useQuery({
    queryKey: ["/api/agencies", agencyId],
    queryFn: async () => {
      if (!agencyId) return null;
      const response = await fetch(`/api/agencies`);
      if (!response.ok) return null;
      const agencies = await response.json();
      return agencies.find((a: any) => a.id === agencyId) || null;
    },
    enabled: !!agencyId,
  });

  const { data: response = { data: [], total: 0 }, isLoading } = useQuery<{
    data: any[];
    total: number;
    limit: number;
    offset: number;
  }>({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") queryParams.append(key, value.toString());
      });

      const res = await fetch(`/api/properties?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    },
  });

  const properties = response.data;
  const total = response.total;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  // Title based on whether we're filtering by agency
  const pageTitle = agency
    ? `Propiedades de ${agency.name}`
    : "Propiedades";
  const pageSubtitle = agency
    ? `Explora las propiedades de ${agency.name}`
    : "Encuentra la propiedad perfecta";

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Calculate display range
  const startItem = total > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div className="min-h-screen bg-background pt-28">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageSubtitle}</p>
          </div>

          {/* Mensaje de upgrade para usuarios pre-registrados */}
          <FeatureGate 
            feature="canAccessAgencyDashboard"
            message="Descubre todas las funcionalidades avanzadas al completar tu registro"
            showUpgradeButton={true}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Registro completo - Acceso total</span>
                </div>
                <span className="text-green-600 text-sm">¡Felicidades! Tienes acceso a todas las funcionalidades</span>
              </div>
            </div>
          </FeatureGate>

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
              {/* Results counter */}
              {!isLoading && total > 0 && (
                <div className="mb-4 text-sm text-muted-foreground">
                  Mostrando {startItem}-{endItem} de {total} propiedades
                </div>
              )}

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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((property: any) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>

                          {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                              {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
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
      <FooterInmo />
    </div>
  );
}

