import Header from "@/components/header";
import HeroSearch from "@/components/hero-search";
import PropertyCard from "@/components/property-card";
import LocationGrid from "@/components/location-grid";
import SubscriptionPlans from "@/components/subscription-plans";
import TutorialOverlay from "@/components/tutorial-overlay";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Landing() {
  const { data: featuredProperties = [] } = useQuery({
    queryKey: ["/api/properties/featured?limit=6"],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HeroSearch />
      
      {/* Banner Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
            <div className="text-muted-foreground">
              <div className="text-lg font-medium mb-2">Banner publicitario</div>
              <div className="text-sm">1200x150px</div>
            </div>
          </div>
        </div>
      </section>

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
            {featuredProperties.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Side Banners */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
              <div className="text-muted-foreground">
                <div className="text-lg font-medium mb-2">Banner publicitario</div>
                <div className="text-sm">590x150px</div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8 text-center border-2 border-dashed border-border">
              <div className="text-muted-foreground">
                <div className="text-lg font-medium mb-2">Banner publicitario</div>
                <div className="text-sm">590x150px</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LocationGrid locations={locations} />
      <SubscriptionPlans />
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                InmoPortal
              </h3>
              <p className="text-muted-foreground mb-4">
                Plataforma inmobiliaria multi-tenant diseñada para conectar inmobiliarias con sus clientes de manera eficiente y moderna.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link></li>
                <li><Link href="/properties" className="text-muted-foreground hover:text-primary transition-colors">Propiedades</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/subscribe" className="text-muted-foreground hover:text-primary transition-colors">Planes</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 InmoPortal. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <TutorialOverlay />
    </div>
  );
}
