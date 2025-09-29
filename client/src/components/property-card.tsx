import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, Square } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: string;
    currency: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    garages?: number;
    address: string;
    images?: string[];
    operationType: string;
    isFeatured?: boolean;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
  };

  return (
    <Card className="property-card overflow-hidden border border-border" data-testid={`property-card-${property.id}`}>
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            data-testid="property-image"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Square className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {property.operationType}
          </Badge>
          {property.isFeatured && (
            <Badge variant="default" className="bg-primary/90">
              Destacada
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-2" data-testid="property-title">
          {property.title}
        </h4>
        
        <p className="text-2xl font-bold text-primary mb-3" data-testid="property-price">
          {property.currency} {formatPrice(property.price)}
        </p>
        
        {/* Property Features */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
          {property.area && (
            <div className="flex items-center" data-testid="property-area">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          )}
          {property.bedrooms && (
            <div className="flex items-center" data-testid="property-bedrooms">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} Dorm</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center" data-testid="property-bathrooms">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} Baños</span>
            </div>
          )}
          {property.garages && (
            <div className="flex items-center" data-testid="property-garages">
              <Car className="h-4 w-4 mr-1" />
              <span>{property.garages} Garajes</span>
            </div>
          )}
        </div>
        
        {/* Address */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate" data-testid="property-address">{property.address}</span>
        </div>
        
        <Link href={`/properties/${property.id}`}>
          <Button className="w-full" data-testid="view-details-button">
            Ver detalles
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
