import { Link } from "wouter";
import "./property-card.css";

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
    <div className="card-prop w-full" data-testid={`property-card-${property.id}`}>
      <Link href={`/properties/${property.id}`} className="go-detail">
        <span className="hover">Más info</span>
        <div 
          className="header no-image relative" 
          style={{
            backgroundImage: `url(${
              property.images?.[0] || 
              `https://source.unsplash.com/random/800x600/?apartment,house,property&sig=${property.id}`
            })`,
            height: "180px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f5f5f5"
          }}
        >
          {property.isFeatured && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold" data-testid={`property-featured-${property.id}`}>
              Destacada
            </span>
          )}
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-semibold capitalize" data-testid={`property-operation-${property.id}`}>
            {property.operationType}
          </span>
        </div>
      </Link>
      <div className="content p-3">
        <h3 className="name-prop text-sm font-semibold mb-1 line-clamp-2" data-testid={`property-title-${property.id}`}>
          {property.title}
        </h3>
        <h2 className="price text-xl font-bold mb-2" data-testid={`property-price-${property.id}`}>
          {property.currency}{formatPrice(property.price)}
        </h2>
        {(property.area || property.bedrooms || property.bathrooms) && (
          <div className="data text-xs text-muted-foreground mb-2" data-testid={`property-details-${property.id}`}>
            {property.area && <span>{property.area} m²</span>}
            {property.area && (property.bedrooms || property.bathrooms) && <span className="mx-1">-</span>}
            {property.bedrooms && <span>{property.bedrooms} Dorm</span>}
            {property.bedrooms && property.bathrooms && <span className="mx-1">-</span>}
            {property.bathrooms && <span>{property.bathrooms} Baños</span>}
          </div>
        )}
        <h6 className="text-xs text-muted-foreground truncate" data-testid={`property-address-${property.id}`}>
          {property.address}
        </h6>
      </div>
    </div>
  );
}
