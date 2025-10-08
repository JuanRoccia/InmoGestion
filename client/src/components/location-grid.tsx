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
    <section className="py-12 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-[24px] font-bold text-[#212121] mb-6">Localidades disponibles</h3>
        {locations.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 pb-2">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/properties?locationId=${location.id}`}
                className="flex-shrink-0 px-6 py-3 bg-white rounded-full border border-[#E0E0E0] text-[14px] text-[#212121] hover:bg-[#FF5733] hover:text-white transition-colors"
                data-testid={`location-${location.slug}`}
              >
                {location.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#757575]">No hay localidades disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}
