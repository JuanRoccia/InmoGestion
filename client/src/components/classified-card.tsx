import { Link } from "wouter";
import { getPropertyImage } from "@/lib/property-images";
import { MapPin, Bed, Bath, Square, Phone, User } from "lucide-react";

interface ClassifiedCardProps {
  property: {
    id: string;
    title: string;
    price: string;
    currency: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    address: string;
    images?: string[];
    operationType: string;
    contactName?: string;
    contactPhone?: string;
  };
}

export default function ClassifiedCard({ property }: ClassifiedCardProps) {
  const imageUrl = property.images?.[0] || getPropertyImage(property.id, 800, 85);

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
  };

  const getOperationLabel = (type: string) => {
    switch (type) {
      case 'venta': return 'Venta';
      case 'alquiler': return 'Alquiler';
      case 'temporario': return 'Alquiler Temporal';
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 bg-[#ff2e06] text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
            {getOperationLabel(property.operationType)}
          </span>
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <Square className="w-3 h-3" />
            {property.area ? `${property.area} m²` : 'Sin especificar'}
          </span>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 flex-1">
            {property.title}
          </h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 text-[#ff2e06]" />
          <span className="truncate">{property.address || 'Ubicación no especificada'}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms} dorms
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property.bathrooms} baños
            </span>
          )}
        </div>

        <div className="border-t pt-3 mt-3">
          <p className="text-2xl font-bold text-[#ff2e06] mb-3">
            {property.currency}{formatPrice(property.price)}
          </p>
          
          {property.contactName && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <User className="w-4 h-4 text-[#ff2e06]" />
              <span>Contacto: {property.contactName}</span>
            </div>
          )}
          
          {property.contactPhone && (
            <a
              href={`tel:${property.contactPhone}`}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-[#ff2e06] hover:bg-[#e62905] text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              Contactar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
