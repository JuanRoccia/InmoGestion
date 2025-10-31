import { Link } from "wouter";

export interface LocationGridProps {
  locations: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
  }>;
}

export default function LocationGrid({ locations }: LocationGridProps) {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">Búsqueda por localidad</h2>
        {locations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/properties?locationId=${location.id}`}
                className="group relative overflow-hidden rounded-sm aspect-[4/3] bg-muted hover:shadow-lg transition-all duration-300"
                data-testid={`location-${location.slug}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(/assets/locations/${location.slug}.jpg)`,
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold text-center px-2">
                    {location.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay localidades disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}
