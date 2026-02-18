import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, DollarSign, Home, User, Phone, FileText, CheckCircle } from "lucide-react";

interface PropertyRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  operationType: string;
  propertyType: string;
  location: string;
  budget: string;
  details: string;
  createdAt: string;
}

interface PublishRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PropertyRequest | null;
  onSuccess: () => void;
}

const publishFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.string().min(1, "El precio es requerido"),
  address: z.string().optional(),
  area: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  operationType: z.string().min(1, "El tipo de operación es requerido"),
});

type PublishFormData = z.infer<typeof publishFormSchema>;

export default function PublishRequestDialog({ 
  open, 
  onOpenChange, 
  request,
  onSuccess 
}: PublishRequestDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<PublishFormData>({
    resolver: zodResolver(publishFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      address: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      operationType: "",
    },
  });

  useEffect(() => {
    if (request) {
      form.reset({
        title: `Busco ${request.propertyType} en ${request.operationType} - ${request.location}`,
        description: request.details || `Solicitud de ${request.propertyType} en ${request.location}. Presupuesto: ${request.budget}. Contacto: ${request.firstName} ${request.lastName}`,
        price: request.budget.replace(/[^0-9]/g, "") || "",
        address: request.location,
        area: "",
        bedrooms: "",
        bathrooms: "",
        operationType: request.operationType,
      });
      setIsSuccess(false);
    }
  }, [request, form]);

  const publishMutation = useMutation({
    mutationFn: async (data: PublishFormData) => {
      if (!request) throw new Error("No request");
      
      const response = await apiRequest("POST", `/api/property-requests/${request.id}/publish`, {
        ...data,
        price: data.price,
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "¡Publicación exitosa!",
        description: "La propiedad ha sido publicada en clasificados.",
      });
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/property-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/classifieds"] });
      setTimeout(() => {
        onOpenChange(false);
        onSuccess();
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo publicar la solicitud",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PublishFormData) => {
    publishMutation.mutate(data);
  };

  if (!request) return null;

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">¡Publicación exitosa!</h3>
            <p className="text-gray-600">La propiedad ha sido publicada en clasificados.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publicar solicitud en clasificados</DialogTitle>
        </DialogHeader>

        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
          <p className="font-medium text-blue-800 mb-1">Datos del solicitante:</p>
          <p className="text-blue-700">
            <User className="w-4 h-4 inline mr-1" />
            {request.firstName} {request.lastName}
            <span className="mx-2">|</span>
            <Phone className="w-4 h-4 inline mr-1" />
            {request.phone}
          </p>
          <p className="text-blue-700 mt-1">
            <MapPin className="w-4 h-4 inline mr-1" />
            {request.location}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la propiedad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="operationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Operación</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="alquiler">Alquiler</SelectItem>
                        <SelectItem value="temporario">Alquiler Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Precio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección completa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="m²" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dormitorios</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Cantidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baños</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Cantidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción de la propiedad" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#ff2e06] hover:bg-[#e62905]"
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending ? "Publicando..." : "Publicar en Clasificados"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
