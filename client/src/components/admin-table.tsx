import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Eye } from "lucide-react";

export default function AdminTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ["/api/agencies", { search: searchQuery }],
    queryFn: async () => {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const response = await fetch(`/api/agencies${params}`);
      if (!response.ok) throw new Error('Failed to fetch agencies');
      return response.json();
    },
  });

  const deleteAgencyMutation = useMutation({
    mutationFn: async (agencyId: string) => {
      await apiRequest("DELETE", `/api/agencies/${agencyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agencies"] });
      toast({
        title: "Éxito",
        description: "Inmobiliaria eliminada correctamente",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmobiliaria",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAgency = (agencyId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta inmobiliaria?")) {
      deleteAgencyMutation.mutate(agencyId);
    }
  };

  const handleSearch = () => {
    // The search is automatically triggered by the query dependency
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Inmobiliarias</CardTitle>
        
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Buscar inmobiliaria por nombre o email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-agencies"
            />
            <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <Button onClick={handleSearch} data-testid="search-button">
            BUSCAR
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-foreground p-4 bg-muted/30 rounded-t-lg">
          <div className="col-span-3">Nombre</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-3">Acciones</div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : agencies.length > 0 ? (
          <div className="divide-y divide-border">
            {agencies.map((agency: any) => (
              <div
                key={agency.id}
                className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-muted/30 transition-colors"
                data-testid={`agency-row-${agency.id}`}
              >
                <div className="col-span-3">
                  <span className="font-medium text-foreground" data-testid="agency-name">
                    {agency.name}
                  </span>
                </div>
                <div className="col-span-4">
                  <span className="text-muted-foreground" data-testid="agency-email">
                    {agency.email}
                  </span>
                </div>
                <div className="col-span-2">
                  <Badge
                    variant={agency.isActive ? "default" : "destructive"}
                    className={agency.isActive ? "bg-green-100 text-green-800" : ""}
                    data-testid="agency-status"
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      agency.isActive ? "bg-green-400" : "bg-red-400"
                    }`}></div>
                    {agency.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50"
                    data-testid={`view-agency-${agency.id}`}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Perfil
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 hover:text-orange-800 border-orange-200 hover:bg-orange-50"
                    data-testid={`edit-agency-${agency.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteAgency(agency.id)}
                    disabled={deleteAgencyMutation.isPending}
                    data-testid={`delete-agency-${agency.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No se encontraron inmobiliarias" : "No hay inmobiliarias registradas"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {agencies.length > 0 && (
          <div className="flex items-center justify-center space-x-2 p-4 border-t border-border">
            <Button variant="outline" size="sm" disabled data-testid="prev-page">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground" data-testid="page-1">
              1
            </Button>
            <Button variant="outline" size="sm" disabled data-testid="next-page">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
