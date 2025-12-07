import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertPropertySchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, DollarSign, Home, Camera } from "lucide-react";
import LocationPicker from "@/components/location-picker";

const propertyFormSchema = insertPropertySchema.extend({
  price: z.string().min(1, "El precio es requerido"),
  area: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  garages: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price: property?.price || "",
      currency: property?.currency || "USD",
      area: property?.area?.toString() || "",
      bedrooms: property?.bedrooms?.toString() || "",
      bathrooms: property?.bathrooms?.toString() || "",
      garages: property?.garages?.toString() || "",
      address: property?.address || "",
      operationType: property?.operationType || "venta",
      isFeatured: property?.isFeatured || false,
      isActive: property?.isActive !== false,
      locationId: property?.locationId || "",
      categoryId: property?.categoryId || "",
      latitude: property?.latitude?.toString() || "",
      longitude: property?.longitude?.toString() || "",
    },
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Calculate city location for map centering based on selected locationId
  const selectedLocationId = form.watch("locationId");
  const cityLocation = locations.find((l: any) => l.id === selectedLocationId && l.latitude && l.longitude)
    ? { lat: parseFloat(locations.find((l: any) => l.id === selectedLocationId).latitude), lng: parseFloat(locations.find((l: any) => l.id === selectedLocationId).longitude) }
    : null;


  const createPropertyMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        area: data.area ? parseInt(data.area) : null,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
        garages: data.garages ? parseInt(data.garages) : null,
        images: imageUrls,
        locationId: data.locationId && data.locationId !== "none" ? data.locationId : null,
        categoryId: data.categoryId && data.categoryId !== "none" ? data.categoryId : null,
        latitude: data.latitude ? data.latitude.toString() : null, // Ensure string for decimal type if needed, or number if schema allows
        longitude: data.longitude ? data.longitude.toString() : null,
      };

      if (property) {
        await apiRequest("PUT", `/api/properties/${property.id}`, payload);
      } else {
        await apiRequest("POST", "/api/properties", payload);
      }
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: property ? "Propiedad actualizada correctamente" : "Propiedad creada correctamente",
      });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "No autorizado",
          description: "Iniciando sesión de nuevo...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: property ? "Error al actualizar la propiedad" : "Error al crear la propiedad",
        variant: "destructive",
      });
    },
  });

  const handleAddImage = () => {
    const url = prompt("Ingresa la URL de la imagen:");
    if (url && url.trim()) {
      setImageUrls([...imageUrls, url.trim()]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PropertyFormData) => {
    createPropertyMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Home className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-semibold">Información Básica</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Casa moderna en zona céntrica" {...field} data-testid="property-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Operación *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="operation-type">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="venta">Venta</SelectItem>
                        <SelectItem value="alquiler">Alquiler</SelectItem>
                        <SelectItem value="temporario">Temporario</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="category-select">
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Sin categoría</SelectItem>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe la propiedad en detalle..."
                        className="min-h-[100px]"
                        {...field}
                        data-testid="property-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Price and Features */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-semibold">Precio y Características</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} data-testid="property-price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="currency-select">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ARS">ARS</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} data-testid="property-area" />
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
                      <Input type="number" placeholder="0" {...field} data-testid="property-bedrooms" />
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
                      <Input type="number" placeholder="0" {...field} data-testid="property-bathrooms" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garajes</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} data-testid="property-garages" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-semibold">Ubicación</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="location-select">
                          <SelectValue placeholder="Selecciona localidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Sin localidad</SelectItem>
                        {locations.map((location: any) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Dirección completa" {...field} data-testid="property-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Map Picker */}
            <div className="mt-4">
              <FormLabel>Ubicación en Mapa (Opcional)</FormLabel>
              <div className="mt-2 border rounded-lg overflow-hidden h-[300px]">
                <LocationPicker
                  latitude={form.watch("latitude") ? parseFloat(form.watch("latitude")!) : undefined}
                  longitude={form.watch("longitude") ? parseFloat(form.watch("longitude")!) : undefined}
                  cityLocation={cityLocation}
                  onLocationSelect={(lat, lng) => {
                    form.setValue("latitude", lat.toString());
                    form.setValue("longitude", lng.toString());
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Latitud</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="h-8 text-xs bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Longitud</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="h-8 text-xs bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Camera className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-semibold">Imágenes</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                      data-testid={`property-image-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`remove-image-${index}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddImage}
                data-testid="add-image-button"
              >
                Agregar Imagen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configuración</h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="property-featured"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Marcar como propiedad destacada
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="property-active"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Propiedad activa (visible en búsquedas)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="cancel-button">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createPropertyMutation.isPending}
            data-testid="save-property"
          >
            {createPropertyMutation.isPending
              ? "Guardando..."
              : property
                ? "Actualizar Propiedad"
                : "Crear Propiedad"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
