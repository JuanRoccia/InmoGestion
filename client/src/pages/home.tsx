import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import HeroSearch from "@/components/hero-search";
import FeaturedPropertiesSection from "@/components/featured-properties-section";
import LocationGrid from "@/components/location-grid";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, BarChart3, Users } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: string;
  currency: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  images?: string[];
  operationType: 'venta' | 'alquiler' | 'temporario';
  isFeatured?: boolean;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export default function Home() {
  const { user } = useAuth();

  const { data: featuredProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=venta"],
  });

  const { data: featuredRentProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=alquiler"],
  });

  const { data: featuredTemporaryProperties = [] } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=temporario"],
  });

  interface Agency {
    id: string;
    name: string;
    ownerId: string;
  }

  const { data: agencies = [] } = useQuery<Agency[]>({
    queryKey: ["/api/agencies"],
    enabled: !!user?.id,
  });

  const userAgency = agencies.find(agency => agency.ownerId === user?.id);

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Dashboard Quick Stats for Agency Owners */}
      {userAgency && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Panel de Control - {userAgency.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center">
                  <Building2 className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Propiedades</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center">
                  <BarChart3 className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vistas este mes</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center">
                  <Users className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">Consultas</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <Link href="/dashboard">
                <Button className="mr-4">Ir al Dashboard</Button>
              </Link>
              {!userAgency && (
                <Link href="/subscribe">
                  <Button variant="outline">Crear Inmobiliaria</Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <HeroSearch />

      {/* Featured Properties - Sale */}
      <FeaturedPropertiesSection
        title="Propiedades destacadas en venta"
        properties={featuredProperties}
        viewMoreLink="/properties?operationType=venta"
      />

      {/* Featured Properties - Rent */}
      <FeaturedPropertiesSection
        title="Propiedades destacadas en alquiler"
        properties={featuredRentProperties}
        viewMoreLink="/properties?operationType=alquiler"
        bgClass="bg-muted/30"
      />

      {/* Featured Properties - Temporary */}
      <FeaturedPropertiesSection
        title="Propiedades destacadas temporarias"
        properties={featuredTemporaryProperties}
        viewMoreLink="/properties?operationType=temporario"
      />

      <LocationGrid locations={locations} />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              InmoPortal
            </h3>
            <p className="text-sm text-muted-foreground">
              © 2024 InmoPortal. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
