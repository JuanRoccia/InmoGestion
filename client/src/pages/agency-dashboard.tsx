import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import useAuthModalStore from "@/stores/auth-modal-store";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAgencySchema } from "@shared/schema";
import Header from "@/components/header";
import PropertyForm from "@/components/property-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Building2, Eye, Edit, Trash2 } from "lucide-react";

// Use shared schema but omit fields that will be set server-side
const agencyFormSchema = insertAgencySchema.pick({
  name: true,
  email: true,
  phone: true,
  address: true,
  description: true,
  website: true,
});

export default function AgencyDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  // Verify subscription if returning from payment
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('payment_success')) {
      apiRequest("POST", "/api/agencies/verify-subscription")
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/agencies"] });
          toast({
            title: "¡Suscripción Activa!",
            description: "Tu agencia ha sido activada correctamente.",
          });
          // Remove param
          setLocation("/agency-dashboard");
        })
        .catch((err) => {
          console.error("Verification failed", err);
        });
    }
  }, [search, queryClient, toast, setLocation]);

  // Redirect to home if not authenticated
  const { setIsOpen } = useAuthModalStore();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isLoading, setIsOpen]);

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
      queryClient.invalidateQueries({ queryKey: ["/api/properties", { agencyId: agency?.id }], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"], refetchType: 'all' });
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
    // Invalidate with the exact same key structure as the query
    queryClient.invalidateQueries({ queryKey: ["/api/properties", { agencyId: agency?.id }], refetchType: 'all' });
    queryClient.invalidateQueries({ queryKey: ["/api/properties"], refetchType: 'all' });
    queryClient.invalidateQueries({ queryKey: ["/api/agencies"], refetchType: 'all' });
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

  const form = useForm({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      website: "",
    },
  });

  const createAgencyMutation = useMutation({
    mutationFn: async (data: typeof agencyFormSchema._type) => {
      const response = await apiRequest("POST", "/api/agencies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agencies"] });
      toast({
        title: "¡Pre-registro Exitoso!",
        description: "Tu agencia ha sido creada. Ahora suscríbete para activarla.",
      });
      // Redirect to subscription
      setLocation("/subscribe");
    },
    onError: (error: any) => {
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
        description: "No se pudo crear la inmobiliaria",
        variant: "destructive",
      });
    },
  });

  const onSubmitAgency = (data: typeof agencyFormSchema._type) => {
    createAgencyMutation.mutate(data);
  };

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Registrar Inmobiliaria</CardTitle>
                <p className="text-muted-foreground">
                  Completa los datos para crear tu inmobiliaria
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitAgency)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la Inmobiliaria</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name" placeholder="Ej: Inmobiliaria ABC" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" data-testid="input-email" placeholder="Ej: contacto@inmobiliaria.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-phone" placeholder="Ej: 2914567890" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-address" placeholder="Ej: Calle Principal 123" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción (opcional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="textarea-description" placeholder="Describe tu inmobiliaria..." rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={createAgencyMutation.isPending}
                        data-testid="button-submit"
                        className="flex-1"
                      >
                        {createAgencyMutation.isPending ? "Procesando..." : "Continuar a Suscripción"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
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

            {agency.subscriptionStatus !== 'active' && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                <p className="font-bold">Modo Vista Previa</p>
                <p>Tu agencia está pendiente de activación. Suscríbete para publicar tus propiedades.</p>
                <Button
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => setLocation("/subscribe")}
                >
                  Activar Suscripción
                </Button>
              </div>
            )}

            <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-property">
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
