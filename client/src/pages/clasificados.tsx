import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import ClassifiedCard from "@/components/classified-card";
import FooterInmo from "@/components/footer-inmo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Building2 } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function Clasificados() {
  const [currentPage, setCurrentPage] = useState(1);
  const [operationType, setOperationType] = useState("all");
  const [locationId, setLocationId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const { data: response, isLoading } = useQuery<{
    data: any[];
    total: number;
    limit: number;
    offset: number;
  }>({
    queryKey: ["/api/classifieds", { operationType, locationId, categoryId, currentPage }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (operationType !== "all") params.append("operationType", operationType);
      if (locationId !== "all") params.append("locationId", locationId);
      if (categoryId !== "all") params.append("categoryId", categoryId);
      params.append("limit", ITEMS_PER_PAGE.toString());
      params.append("offset", ((currentPage - 1) * ITEMS_PER_PAGE).toString());

      const res = await fetch(`/api/classifieds?${params}`);
      if (!res.ok) throw new Error("Failed to fetch classifieds");
      return res.json();
    },
  });

  const classifieds = response?.data || [];
  const total = response?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#ff2e06] to-[#e62905] rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Clasificados</h1>
                <p className="text-white/90">Propiedades buscadas por usuarios</p>
              </div>
            </div>
            <p className="text-white/80 max-w-2xl">
              Aquí encontrarás propiedades que buscan activamente los usuarios. 
              Si tienes una propiedad que coincide con alguna solicitud, ¡contáctanos para publicarla!
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtros</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tipo de Operación
                </label>
                <Select value={operationType} onValueChange={(v) => { setOperationType(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las operaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las operaciones</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                    <SelectItem value="temporario">Alquiler Temporal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Ubicación
                </label>
                <Select value={locationId} onValueChange={(v) => { setLocationId(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    {locations.map((loc: any) => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tipo de Propiedad
                </label>
                <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {total > 0 ? (
                <>Se encontraron <span className="font-semibold text-[#ff2e06]">{total}</span> clasificados</>
              ) : (
                "No se encontraron clasificados"
              )}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && classifieds.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No hay clasificados disponibles
              </h3>
              <p className="text-gray-600 mb-6">
                Próximamente tendrás acceso a clasificados de propiedades buscadas por usuarios.
              </p>
              <Button 
                onClick={() => window.location.href = '/solicitar-inmueble'}
                className="bg-[#ff2e06] hover:bg-[#e62905] text-white"
              >
                Buscar mi propiedad ideal
              </Button>
            </div>
          )}

          {/* Classifieds Grid */}
          {!isLoading && classifieds.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classifieds.map((property) => (
                <ClassifiedCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-300"
                >
                  Anterior
                </Button>
                
                {getPageNumbers().map((page, i) => (
                  page === "ellipsis" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page 
                        ? "bg-[#ff2e06] hover:bg-[#e62905] text-white border-[#ff2e06]" 
                        : "border-gray-300"
                      }
                    >
                      {page}
                    </Button>
                  )
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-300"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterInmo />
    </div>
  );
}
