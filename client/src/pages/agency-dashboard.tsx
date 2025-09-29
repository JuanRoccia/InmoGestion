import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import PropertyForm from "@/components/property-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Building2, Eye, Edit, Trash2 } from "lucide-react";

export default function AgencyDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: agency } = useQuery({
    queryKey: ["/api/agencies"],
    select: (agencies: any[]) => agencies.find((a: any) => a.ownerId === user?.id),
    enabled: !!user?.id,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["/api/properties", { agencyId: agency?.id }],
    enabled: !!agency?.id,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Éxito",
        description: "Propiedad eliminada correctamente",
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
        description: "No se pudo eliminar la propiedad",
        variant: "destructive",
      });
    },
  });

  const handleEditProperty = (property: any) => {
    setEditingProperty(property);
    setIsPropertyDialogOpen(true);
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  const handlePropertyFormSuccess = () => {
    setIsPropertyDialogOpen(false);
    setEditingProperty(null);
    queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">No tienes una inmobiliaria</h1>
            <p className="text-muted-foreground mb-6">
              Necesitas crear una inmobiliaria para acceder al dashboard
            </p>
            <Button onClick={() => window.location.href = "/subscribe"}>
              Crear Inmobiliaria
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard - {agency.name}</h1>
              <p className="text-muted-foreground">Gestiona tus propiedades y estadísticas</p>
            </div>
            
            <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="add-property-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Propiedad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProperty ? "Editar Propiedad" : "Nueva Propiedad"}
                  </DialogTitle>
                </DialogHeader>
                <PropertyForm
                  property={editingProperty}
                  onSuccess={handlePropertyFormSuccess}
                  onCancel={() => {
                    setIsPropertyDialogOpen(false);
                    setEditingProperty(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Propiedades</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="total-properties">
                  {properties.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="active-properties">
                  {properties.filter((p: any) => p.isActive).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Destacadas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="featured-properties">
                  {properties.filter((p: any) => p.isFeatured).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Table */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Propiedades</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length > 0 ? (
                <div className="space-y-4">
                  {properties.map((property: any) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                      data-testid={`property-row-${property.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{property.title}</h3>
                          <Badge variant="secondary">{property.operationType}</Badge>
                          {property.isFeatured && (
                            <Badge variant="default">Destacada</Badge>
                          )}
                          {!property.isActive && (
                            <Badge variant="destructive">Inactiva</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                        <p className="text-lg font-bold text-primary">
                          {property.currency} {parseFloat(property.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                          data-testid={`edit-property-${property.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={deletePropertyMutation.isPending}
                          data-testid={`delete-property-${property.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes propiedades registradas</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comienza agregando tu primera propiedad
                  </p>
                  <Button
                    onClick={() => setIsPropertyDialogOpen(true)}
                    data-testid="add-first-property"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primera Propiedad
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
