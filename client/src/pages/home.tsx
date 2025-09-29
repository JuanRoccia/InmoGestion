import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import HeroSearch from "@/components/hero-search";
import PropertyCard from "@/components/property-card";
import LocationGrid from "@/components/location-grid";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, BarChart3, Users } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  const { data: featuredProperties = [] } = useQuery({
    queryKey: ["/api/properties/featured?limit=6"],
  });

  const { data: userAgency } = useQuery({
    queryKey: ["/api/agencies"],
    select: (agencies: any[]) => agencies.find(agency => agency.ownerId === user?.id),
  });

  const { data: locations = [] } = useQuery({
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
      
      {/* Featured Properties */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-foreground">
              Propiedades destacadas en venta
            </h3>
            <Link href="/properties?operationType=venta">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Ver más →
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No hay propiedades destacadas disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>

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
