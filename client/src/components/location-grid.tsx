import { Link } from "wouter";

interface LocationGridProps {
  locations: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
  }>;
}

export default function LocationGrid({ locations }: LocationGridProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Búsqueda por localidad
          </h3>
          <p className="text-lg text-muted-foreground">
            Explora propiedades en diferentes zonas
          </p>
        </div>
        
        {locations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/properties?locationId=${location.id}`}
                className="group relative overflow-hidden rounded-lg aspect-square"
                data-testid={`location-${location.slug}`}
              >
                {location.imageUrl ? (
                  <img
                    src={location.imageUrl}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors duration-300" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="font-semibold text-sm uppercase" data-testid="location-name">
                    {location.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay localidades disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}
