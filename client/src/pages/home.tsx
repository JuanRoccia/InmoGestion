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
  
  // Mock data for featured properties
  const mockProperties: { 
    sale: Property[];
    rent: Property[];
    temporary: Property[];
  } = {
    sale: [
      {
        id: "1",
        title: "Ab id cumque numquam",
        price: "1758992",
        currency: "USD",
        area: 485,
        bedrooms: 2,
        bathrooms: 4,
        address: "Urbanización Tadeo Manjón 64",
        images: ["/assets/logo.png"],
        operationType: "venta",
        isFeatured: true
      },
      {
        id: "2",
        title: "Ea fuga similique molest",
        price: "3305866",
        currency: "USD",
        area: 464,
        bedrooms: 2,
        bathrooms: 3,
        address: "Glorieta de Carmelo Dorioso 52",
        images: ["/assets/logo.png"],
        operationType: "venta",
        isFeatured: true
      },
      {
        id: "3",
        title: "Ipsa corporis odit in max",
        price: "1338350",
        currency: "USD",
        area: 102,
        bedrooms: 6,
        bathrooms: 2,
        address: "Vial Evelia Simo 74 Piso 1",
        images: ["/assets/logo.png"],
        operationType: "venta",
        isFeatured: true
      }
    ],
    rent: [
      {
        id: "4",
        title: "Cum alias dolores magni",
        price: "3314790",
        currency: "USD",
        area: 464,
        bedrooms: 1,
        bathrooms: 3,
        address: "Alameda de Eladio Sandoval 8",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      },
      {
        id: "5",
        title: "Provident necessitatibus",
        price: "3352349",
        currency: "USD",
        area: 395,
        bedrooms: 3,
        bathrooms: 2,
        address: "Pasadizo Carina Bernal 6 Piso 9",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      }
    ],
    temporary: [
      {
        id: "6",
        title: "Aut earum cumque",
        price: "4172624",
        currency: "USD",
        area: 153,
        bedrooms: 4,
        bathrooms: 2,
        address: "C. de Maxi Araujo 247",
        images: ["/assets/logo.png"],
        operationType: "temporario",
        isFeatured: true
      }
    ]
  };

  const { data: featuredProperties = mockProperties.sale } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=venta"],
  });

  const { data: featuredRentProperties = mockProperties.rent } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=alquiler"],
  });

  const { data: featuredTemporaryProperties = mockProperties.temporary } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=temporario"],
  });

  interface Agency {
    id: string;
    name: string;
    ownerId: string;
  }

  const { data: userAgency } = useQuery<Agency[], Error, Agency | undefined>({
    queryKey: ["/api/agencies"],
    select: (agencies) => agencies.find(agency => agency.ownerId === user?.id),
  });

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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProperties.map((property: any) => (
              <div key={property.id} className="col-span-1">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Rent */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-foreground">
              Propiedades destacadas en alquiler
            </h3>
            <Link href="/properties?operationType=alquiler">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Ver más →
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredRentProperties.map((property: any) => (
              <div key={property.id} className="col-span-1">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties - Temporary */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-foreground">
              Propiedades destacadas temporarias
            </h3>
            <Link href="/properties?operationType=temporario">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Ver más →
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredTemporaryProperties.map((property: any) => (
              <div key={property.id} className="col-span-1">
                <PropertyCard property={property} />
              </div>
            ))}
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
