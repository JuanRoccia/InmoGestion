import Header from "@/components/header";
import HeroSearch from "@/components/hero-search";
import PropertyCard from "@/components/property-card";
import LocationGrid from "@/components/location-grid";
import SubscriptionPlans from "@/components/subscription-plans";
import TutorialOverlay from "@/components/tutorial-overlay";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SectionTitle from "@/components/ui/SectionTitle";
import AdBanner from "@/components/ui/AdBanner";

export default function Landing() {
  const { data: featuredProperties = [] } = useQuery({
    queryKey: ["/api/properties/featured?limit=6"],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-28">
        <HeroSearch />

        {/* Buttons Section */}
        <section className="py-8 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="buttons-busqueda flex justify-center gap-6">
              <Link href="/inmobiliarias">
                <Button className="p-button p-component bg-[#FF5733] hover:bg-[#ff6e52] text-white px-8 py-3 rounded">
                  Buscar por inmobiliaria
                </Button>
              </Link>
              <Link href="/mapa">
                <Button className="p-button p-component bg-[#FF5733] hover:bg-[#ff6e52] text-white px-8 py-3 rounded">
                  Búsqueda por mapa
                </Button>
              </Link>
            </div>
          </div>
        </section>

      {/* Banner superior */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <AdBanner width={1200} height={150} />
        </div>
      </section>

      {/* Propiedades destacadas en venta */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <SectionTitle>Propiedades destacadas en venta</SectionTitle>
            <Link href="/properties?operationType=venta">
              <Button variant="ghost" className="text-[#FF5733] hover:text-[#ff6e52] p-0 h-auto">
                Ver más →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Banners intermedios */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section>

      {/* Propiedades destacadas en alquiler */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <SectionTitle>Propiedades destacadas en alquiler</SectionTitle>
            <Link href="/properties?operationType=alquiler">
              <Button variant="ghost" className="text-[#FF5733] hover:text-[#ff6e52] p-0 h-auto">
                Ver más →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property: any) => (
              <PropertyCard key={`alq-${property.id}`} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Banners intermedios */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <SectionTitle>Countries – Barrios Cerrados – Terrenos</SectionTitle>
            <Link href="/properties?category=terrenos">
              <Button variant="ghost" className="text-[#FF5733] hover:text-[#ff6e52] p-0 h-auto">
                Ver más →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property: any) => (
              <PropertyCard key={`lot-${property.id}`} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Banners intermedios */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <SectionTitle>Emprendimientos destacados</SectionTitle>
            <Link href="/proyectos">
              <Button variant="ghost" className="text-[#FF5733] hover:text-[#ff6e52] p-0 h-auto">
                Ver más →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property: any) => (
              <PropertyCard key={`dev-${property.id}`} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Banners intermedios */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <SectionTitle>Alquileres temporarios</SectionTitle>
            <Link href="/properties?operationType=temporario">
              <Button variant="ghost" className="text-[#FF5733] hover:text-[#ff6e52] p-0 h-auto">
                Ver más →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 6).map((property: any) => (
              <PropertyCard key={`tmp-${property.id}`} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner inferior */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <AdBanner width={1200} height={250} />
        </div>
      </section>

      <LocationGrid locations={locations} />

      {/* Footer minimal, similar estructura */}
      <footer className="bg-[#212121] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center border-t border-white/20 pt-6">
          <p className="text-sm">© 2025 Portal Inmobiliario. Todos los derechos reservados</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
