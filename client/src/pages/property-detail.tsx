import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, Square, Phone, Mail, ExternalLink, Video, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FooterInmo from "@/components/footer-inmo";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet + React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);

  const { data: property, isLoading } = useQuery<any>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  useEffect(() => {
    if (property) {
      if (property.videoUrl) {
        setActiveMedia({ type: 'video', url: property.videoUrl });
      } else if (property.images && property.images.length > 0) {
        setActiveMedia({ type: 'image', url: property.images[0] });
      }
    }
  }, [property]);

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

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const isVideo = activeMedia?.type === 'video';

  return (
    <div className="min-h-screen bg-background pt-28">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column: Media */}
            <div className="lg:col-span-2">

              {/* Media Section */}
              <div className="bg-card rounded-lg overflow-hidden shadow-sm border">
                {/* Main Media */}
                <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                  {/* ... (media code remains same) ... */}
                  {activeMedia ? (
                    activeMedia.type === 'video' ? (
                      <iframe
                        src={getEmbedUrl(activeMedia.url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Property Video"
                      />
                    ) : (
                      <img
                        src={activeMedia.url}
                        alt={property.title}
                        className="w-full h-full object-contain"
                      />
                    )
                  ) : (
                    <div className="text-muted-foreground">Sin multimedia</div>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {/* ... (thumbnails code remains same) ... */}
                  {property.videoUrl && (
                    <div
                      className={`flex-shrink-0 w-24 h-16 rounded cursor-pointer overflow-hidden border-2 relative ${isVideo ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setActiveMedia({ type: 'video', url: property.videoUrl })}
                    >
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Video className="text-white h-6 w-6" />
                      </div>
                    </div>
                  )}
                  {property.images && property.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-24 h-16 rounded cursor-pointer overflow-hidden border-2 relative ${(!isVideo && activeMedia?.url === image) ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setActiveMedia({ type: 'image', url: image })}
                    >
                      <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Info (Title, Price, Address) - Below Media */}
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight" data-testid="property-title">
                  {property.title}
                </h1>

                <div className="text-3xl font-bold text-primary mb-2" data-testid="property-price">
                  {property.currency} {parseFloat(property.price).toLocaleString()}
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span data-testid="property-address">{property.address}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
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
              </div>
            </div>

            {/* Right Column: Contact & Map */}
            <div className="space-y-6">
              <Card className="sticky top-28">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>

                  <div className="text-sm text-muted-foreground mb-6 bg-muted/50 p-4 rounded-lg">
                    <p className="mb-1 text-xs uppercase tracking-wider">Publicado por</p>
                    <p className="font-semibold text-foreground text-lg" data-testid="agency-name">
                      {property.agency?.name || 'Inmobiliaria'}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button className="w-full" size="lg" data-testid="contact-phone" onClick={() => window.open(`tel:${property.agency?.phone || ''}`, '_self')}>
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar ahora
                    </Button>

                    <Button variant="outline" className="w-full" size="lg" data-testid="contact-email" onClick={() => window.open(`mailto:${property.agency?.email || ''}`)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar email
                    </Button>

                    <Button variant="outline" className="w-full" size="lg" data-testid="contact-whatsapp">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>

                  {/* Map Preview */}
                  {(property.latitude && property.longitude) && (
                    <div
                      className="w-full h-48 rounded-lg overflow-hidden border mt-6 relative z-0 cursor-pointer group"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`, '_blank')}
                      title="Ver en Google Maps"
                    >
                      <MapContainer
                        center={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        dragging={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                        zoomControl={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[parseFloat(property.latitude), parseFloat(property.longitude)]} />
                      </MapContainer>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-[300]" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs text-center pointer-events-none z-[400]">
                        <span className="flex items-center justify-center gap-1 font-semibold">
                          <MapPin className="h-3 w-3" /> Ver en Google Maps
                        </span>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full Width Details Section */}
          <div className="grid grid-cols-1 gap-8">
            {/* Property Features */}
            <Card>
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
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="property-description">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {property.services && property.services.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Servicios</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                    {property.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <FooterInmo />
    </div>
  );
}
