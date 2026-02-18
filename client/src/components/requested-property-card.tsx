import { MapPin, Bed, Bath, Square, Calendar, User, DollarSign, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  isPublished?: boolean;
}

interface RequestedPropertyCardProps {
  request: PropertyRequest;
  onPublish: (request: PropertyRequest) => void;
  onViewDetails: (request: PropertyRequest) => void;
  isSubscribed: boolean;
}

export default function RequestedPropertyCard({ 
  request, 
  onPublish, 
  onViewDetails,
  isSubscribed 
}: RequestedPropertyCardProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getOperationLabel = (type: string) => {
    switch (type) {
      case 'venta': return 'Venta';
      case 'alquiler': return 'Alquiler';
      case 'temporario': return 'Alquiler Temporal';
      case 'emprendimiento': return 'Emprendimiento';
      default: return type;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${request.isPublished ? 'border-green-200 bg-green-50' : 'border-gray-100'} hover:shadow-lg transition-shadow`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
              request.operationType === 'venta' 
                ? 'bg-green-100 text-green-800' 
                : request.operationType === 'alquiler'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {getOperationLabel(request.operationType)}
            </span>
            <h3 className="font-bold text-gray-800 text-lg">
              {request.propertyType}
            </h3>
          </div>
          {request.isPublished ? (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Publicado</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>Pendiente</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 text-[#ff2e06]" />
          <span>{request.location}</span>
        </div>

        {/* Budget */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <DollarSign className="w-4 h-4 mr-1 text-[#ff2e06]" />
          <span className="font-semibold">{request.budget}</span>
        </div>

        {/* Details */}
        {request.details && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {request.details}
          </p>
        )}

        {/* Contact Info Preview */}
        <div className="bg-gray-50 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span>{request.firstName} {request.lastName}</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Solicitado el {formatDate(request.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300"
            onClick={() => onViewDetails(request)}
          >
            Ver Detalles
          </Button>
          {request.isPublished ? (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Publicado
            </Button>
          ) : isSubscribed ? (
            <Button
              size="sm"
              className="flex-1 bg-[#ff2e06] hover:bg-[#e62905] text-white"
              onClick={() => onPublish(request)}
            >
              Publicar
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white"
              disabled
              title="Suscríbete para publicar"
            >
              Requiere Suscripción
            </Button>
          )}
        </div>

        {!isSubscribed && !request.isPublished && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            * Suscríbete para publicar esta solicitud
          </p>
        )}
      </div>
    </div>
  );
}
