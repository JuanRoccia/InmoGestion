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
import FooterInmo from "@/components/footer-inmo";
import PropertyForm from "@/components/property-form";
import PromoBanner from "@/components/dashboard/promo-banner";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import StatsCards from "@/components/dashboard/stats-cards";
import ActionBar from "@/components/dashboard/action-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Building2, Mail, AlertTriangle } from "lucide-react";
import RequireCompletedRegistration from "@/components/ProtectedRoute";
import { Property } from "@shared/schema";

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
  const [showRestrictionAlert, setShowRestrictionAlert] = useState(false);

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

  // Handle /agency-dashboard?register=true
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('register') === 'true') {
      setShowRegistration(true);
    }
  }, [search]);

  // Redirect to home if not authenticated
  const { setIsOpen } = useAuthModalStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isLoading, setIsOpen]);

  const { data: agency } = useQuery({
    queryKey: ["/api/agencies"],
    select: (agencies: any[]) => agencies.find((a: any) => a.ownerId === (user as any)?.id),
    enabled: !!(user as any)?.id,
  });

  const { data: properties = [] } = useQuery<Property[]>({
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
        duration: 5000,
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
    queryClient.invalidateQueries({ queryKey: ["/api/properties", { agencyId: agency?.id }], refetchType: 'all' });
    queryClient.invalidateQueries({ queryKey: ["/api/properties"], refetchType: 'all' });
    queryClient.invalidateQueries({ queryKey: ["/api/agencies"], refetchType: 'all' });

    // If restricted, guide to registration
    if (agency?.subscriptionStatus !== 'active' || (user as any)?.registrationStatus !== 'completed') {
      setShowRestrictionAlert(true);
      setShowRegistration(true);
    }
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

  // Verificar si el usuario tiene registro completo
  const registrationStatus = (user as any)?.registrationStatus;

  const [showRegistration, setShowRegistration] = useState(false);

  // Reuse the form setup for registration part (if needed, though normally user has agency here or sees registration)
  // Simplifying: If no agency, show registration component (kept from original code but wrapped neatly)

  if (showRegistration) {
    return <RegistrationView showAlert={showRestrictionAlert} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header is not needed, quedaria reemplazado por el dashboard nav */}
      {/* Header removed as it is replaced by DashboardNav */}
      {/* <Header /> */}

      <div className="flex-grow">
        <DashboardNav agency={agency} />

        <main className="container mx-auto px-4 md:px-8 pb-12">
          <PromoBanner />

          <StatsCards
            totalProperties={properties.length}
            activeProperties={properties.filter((p: any) => p.isActive).length}
            featuredProperties={properties.filter((p: any) => p.isFeatured).length}
            requestedProperties={0} // Mock data for now
          />

          <ActionBar onAddProperty={() => {
            if (!agency) {
              setShowRegistration(true);
              return;
            }
            // Removed pre-emptive check. Allow drafting/previewing.
            // Restriction applies after saving.
            setEditingProperty(null);
            setIsPropertyDialogOpen(true);
          }} />

          {/* Property Limits Display */}
          {agency && (
            <Card className="border-blue-200 bg-blue-50 mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-800 capitalize">
                      Plan {agency.subscriptionPlan}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {properties.length} / {agency.propertyLimit || 20} propiedades usadas
                    </p>
                  </div>
                  {properties.length >= (agency.propertyLimit || 20) * 0.8 && (
                    <Button 
                      onClick={() => setLocation("/subscribe")}
                      variant="outline"
                      className="border-orange-500 text-orange-600 hover:bg-orange-50"
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>Uso de propiedades</span>
                    <span>{Math.round((properties.length / (agency.propertyLimit || 20)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        properties.length >= (agency.propertyLimit || 20) 
                          ? 'bg-red-500' 
                          : properties.length >= (agency.propertyLimit || 20) * 0.8 
                          ? 'bg-orange-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((properties.length / (agency.propertyLimit || 20)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                {properties.length >= (agency.propertyLimit || 20) && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Has alcanzado tu límite. Elimina propiedades o actualiza tu plan.
                  </p>
                )}
                {properties.length >= (agency.propertyLimit || 20) * 0.8 && properties.length < (agency.propertyLimit || 20) && (
                  <p className="text-sm text-orange-600 mt-2">
                    📊 Estás cerca del límite. Considera hacer upgrade para más espacio.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Subscription Warning - moved to bottom of banner area or here as requested */}
          {agency?.subscriptionStatus !== 'active' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-8 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-bold">Modo Vista Previa</p>
                <p className="text-sm">Tu agencia está pendiente de activación. Suscríbete para publicar tus propiedades.</p>
              </div>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-md"
                onClick={() => setLocation("/subscribe")}
              >
                Activar Suscripción
              </Button>
            </div>
          )}

          {/* Properties Table - Refined Look */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Mis Propiedades</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {properties.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {properties.map((property: any) => (
                    <div
                      key={property.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                      data-testid={`property-row-${property.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                        {/* Thumbnail if available */}
                        {property.images && property.images.length > 0 ? (
                          <img src={property.images[0]} alt={property.title} className="w-20 h-20 object-cover rounded-md shadow-sm" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                            <Building2 className="w-8 h-8" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-lg text-gray-800">{property.title}</h3>
                            <Badge variant={property.operationType === 'venta' ? 'default' : 'secondary'} className="capitalize">
                              {property.operationType}
                            </Badge>
                            {property.isFeatured && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">Destacada</Badge>
                            )}
                            {!property.isActive && (
                              <Badge variant="destructive">Inactiva</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{property.address}</p>
                          <p className="text-lg font-bold text-primary">
                            {property.currency} {parseFloat(property.price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 sm:mt-0 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleEditProperty(property)}
                          data-testid={`edit-property-${property.id}`}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={deletePropertyMutation.isPending}
                          data-testid={`delete-property-${property.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white">
                  <Building2 className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No tienes propiedades registradas</p>
                  <p className="text-sm text-gray-400 mb-6">
                    Comienza a gestionar tu cartera de propiedades hoy mismo.
                  </p>
                  <Button
                    onClick={() => {
                      if (!agency) {
                        setShowRegistration(true);
                      } else {
                        // Removed pre-emptive check. Allow drafting.
                        setIsPropertyDialogOpen(true);
                      }
                    }}
                    data-testid="add-first-property"
                    className="shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primera Propiedad
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <FooterInmo />

      {/* Hidden Dialog for Add/Edit Property */}
      <Dialog open={isPropertyDialogOpen} onOpenChange={setIsPropertyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? "Editar Propiedad" : "Nueva Propiedad"}
            </DialogTitle>
          </DialogHeader>
          <PropertyForm
            property={editingProperty}
            agency={agency}
            onSuccess={handlePropertyFormSuccess}
            onCancel={() => {
              setIsPropertyDialogOpen(false);
              setEditingProperty(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component for Registration (extracted for cleanliness)
function RegistrationView({ showAlert }: { showAlert?: boolean }) {
  const { toast } = useToast();
  // ... needs context form hooks ...
  // To avoid complexity of passing too many props or redefining hooks, I'll inline the logic BUT simplify the UI.
  // REVISITING: The original file had logic inside the main component. 
  // I will create a simple wrapper or just bring back the necessary logic for the non-agency view
  // since it needs useMutation and useForm which are hooks.

  // It's safer to just return the form here directly if I want to avoid hook rules issues 
  // or just use the same component structure but with early return inside the main component as before.
  // So I will revert to using the main component for logic and just render the form.

  // However, to keep this clean, I will execute the hook logic at the top level (already done) 
  // and just render the JSX here. But wait, I need the form object and mutation.

  // Let's copy the form logic back into a separate component or just keep it in the main one and return early.
  // The 'if (!agency)' block in the main component handles this. 
  // See below for the fixed implementation that includes the form logic and render.

  // Actually, for simplicity and to avoid hook errors, I'll move the registration form logic 
  // into a separate component defined in the same file.
  return <RegistrationForm showAlert={showAlert} />;
}

function RegistrationForm({ showAlert }: { showAlert?: boolean }) {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(showAlert || false);

  // Sync internal state with prop just in case, though usually initial is fine
  useEffect(() => {
    if (showAlert) setIsAlertOpen(true);
  }, [showAlert]);

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
      setLocation("/subscribe");
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        // Handle auth error
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

  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Alert Dialog for Restricted Access */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="border-red-200 bg-red-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Acceso Restringido
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-800 font-medium">
              Para continuar con la publicación y activar tu propiedad, debes completar el registro de tu inmobiliaria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsAlertOpen(false)}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Continuar a Registro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Header />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Restricted Access Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">Acceso Restringido:</span> Para continuar con la publicación, debes completar el registro de tu inmobiliaria.
                </p>
              </div>
            </div>
          </div>

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

