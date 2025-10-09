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
  
  // Mock data for featured properties - 6 properties per section
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
      },
      {
        id: "7",
        title: "Cum alias dolores magni",
        price: "3314790",
        currency: "$",
        area: 464,
        bedrooms: 1,
        bathrooms: 1,
        address: "Alameda de Eladio Sandoval 8",
        images: ["/assets/logo.png"],
        operationType: "venta",
        isFeatured: true
      },
      {
        id: "8",
        title: "Provident necessitatibus",
        price: "3352349",
        currency: "$",
        area: 395,
        bedrooms: 3,
        bathrooms: 2,
        address: "Pasadizo Carina Bernal 6 Piso 9",
        images: ["/assets/logo.png"],
        operationType: "venta",
        isFeatured: true
      },
      {
        id: "9",
        title: "Aut earum cumque",
        price: "4172624",
        currency: "$",
        area: 153,
        bedrooms: 4,
        bathrooms: 1,
        address: "C. de Maxi Araujo 247",
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
        currency: "$",
        area: 464,
        bedrooms: 1,
        bathrooms: 1,
        address: "Alameda de Eladio Sandoval 8",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      },
      {
        id: "5",
        title: "Provident necessitatibus",
        price: "3352349",
        currency: "$",
        area: 395,
        bedrooms: 3,
        bathrooms: 2,
        address: "Pasadizo Carina Bernal 6 Piso 9",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      },
      {
        id: "10",
        title: "Aut earum cumque",
        price: "4172624",
        currency: "$",
        area: 153,
        bedrooms: 4,
        bathrooms: 1,
        address: "C. de Maxi Araujo 247",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      },
      {
        id: "11",
        title: "Dignissimos voluptas",
        price: "2850000",
        currency: "$",
        area: 320,
        bedrooms: 2,
        bathrooms: 2,
        address: "Plaza de Ana Delgado 15",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      },
      {
        id: "12",
        title: "Excepturi mollitia",
        price: "1950000",
        currency: "$",
        area: 180,
        bedrooms: 1,
        bathrooms: 1,
        address: "Travesía Lucía Mora 89",
        images: ["/assets/logo.png"],
        operationType: "alquiler",
        isFeatured: true
      },
      {
        id: "13",
        title: "Quaerat impedit",
        price: "3750000",
        currency: "$",
        area: 420,
        bedrooms: 3,
        bathrooms: 3,
        address: "Calle Mayor 234",
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
        currency: "$",
        area: 153,
        bedrooms: 4,
        bathrooms: 2,
        address: "C. de Maxi Araujo 247",
        images: ["/assets/logo.png"],
        operationType: "temporario",
        isFeatured: true
      },
      {
        id: "14",
        title: "Temporario de lujo",
        price: "5200000",
        currency: "$",
        area: 280,
        bedrooms: 3,
        bathrooms: 2,
        address: "Avenida del Mar 456",
        images: ["/assets/logo.png"],
        operationType: "temporario",
        isFeatured: true
      },
      {
        id: "15",
        title: "Casa de verano",
        price: "3900000",
        currency: "$",
        area: 250,
        bedrooms: 4,
        bathrooms: 3,
        address: "Costa Azul 123",
        images: ["/assets/logo.png"],
        operationType: "temporario",
        isFeatured: true
      },
      {
        id: "16",
        title: "Departamento vacacional",
        price: "2800000",
        currency: "$",
        area: 150,
        bedrooms: 2,
        bathrooms: 1,
        address: "Paseo Marítimo 789",
        images: ["/assets/logo.png"],
        operationType: "temporario",
        isFeatured: true
      },
      {
        id: "17",
        title: "Villa temporaria",
        price: "6500000",
        currency: "$",
        area: 380,
        bedrooms: 5,
        bathrooms: 4,
        address: "Zona Residencial Premium 12",
        images: ["/assets/logo.png"],
        operationType: "temporario",
        isFeatured: true
      },
      {
        id: "18",
        title: "Chalet de temporada",
        price: "4750000",
        currency: "$",
        area: 310,
        bedrooms: 3,
        bathrooms: 2,
        address: "Urbanización Las Palmeras 45",
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
    select: (agencies: Agency[]) => agencies.find(agency => agency.ownerId === user?.id),
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
