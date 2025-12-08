import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, Square, Phone, Mail, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FooterInmo from "@/components/footer-inmo";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: property, isLoading } = useQuery<any>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-96 w-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-6" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </div>
        <FooterInmo />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background pt-28">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Propiedad no encontrada</h1>
            <p className="text-muted-foreground">La propiedad que buscas no existe o ha sido eliminada.</p>
          </div>
        </div>
        <FooterInmo />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Property Images */}
          <div className="mb-8">
            {property.images && property.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                  data-testid="property-main-image"
                />
                {property.images.length > 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {property.images.slice(1, 5).map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.title} ${index + 2}`}
                        className="w-full h-44 object-cover rounded-lg"
                        data-testid={`property-image-${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Sin imágenes disponibles</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" data-testid="operation-type">
                    {property.operationType}
                  </Badge>
                  {property.isFeatured && (
                    <Badge variant="default">Destacada</Badge>
                  )}
                  {property.isCreditSuitable && (
                    <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                      Apta Crédito
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="property-title">
                  {property.title}
                </h1>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span data-testid="property-address">{property.address}</span>
                </div>

                <div className="text-3xl font-bold text-primary mb-6" data-testid="property-price">
                  {property.currency} {parseFloat(property.price).toLocaleString()}
                </div>
              </div>

              {/* Property Features */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.area && (
                      <div className="flex items-center" data-testid="property-area">
                        <Square className="h-5 w-5 text-primary mr-2" />
                        <span>{property.area} m²</span>
                      </div>
                    )}
                    {property.bedrooms && (
                      <div className="flex items-center" data-testid="property-bedrooms">
                        <Bed className="h-5 w-5 text-primary mr-2" />
                        <span>{property.bedrooms} dormitorios</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center" data-testid="property-bathrooms">
                        <Bath className="h-5 w-5 text-primary mr-2" />
                        <span>{property.bathrooms} baños</span>
                      </div>
                    )}
                    {property.garages && (
                      <div className="flex items-center" data-testid="property-garages">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        <span>{property.garages} garajes</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {property.description && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                    <p className="text-muted-foreground leading-relaxed" data-testid="property-description">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>

                  <div className="space-y-4 mb-6">
                    <Button className="w-full" size="lg" data-testid="contact-phone">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar ahora
                    </Button>

                    <Button variant="outline" className="w-full" size="lg" data-testid="contact-email">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar email
                    </Button>

                    <Button variant="outline" className="w-full" size="lg" data-testid="contact-whatsapp">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Publicado por:</p>
                    <p className="font-semibold text-foreground" data-testid="agency-name">
                      {property.agency?.name || 'Inmobiliaria'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterInmo />
    </div>
  );
}
