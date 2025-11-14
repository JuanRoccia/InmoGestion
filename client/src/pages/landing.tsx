import Header from "@/components/header";
import HeroSearch from "@/components/hero-search";
import Footer from "@/components/ui/footer";
import FeaturedPropertiesSection from "@/components/featured-properties-section";
import FeaturedDevelopmentsFilter from "../components/featured-developments-filter";
import LocationGrid from "@/components/location-grid";
import SubscriptionPlans from "@/components/subscription-plans";
import TutorialOverlay from "@/components/tutorial-overlay";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SectionTitle from "@/components/ui/SectionTitle";
import AdBanner from "@/components/ui/AdBanner";

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
  operationType: string;
  isFeatured?: boolean;
}

export default function Landing() {
  // Datos mock para propiedades en venta
  const mockSaleProperties: Property[] = [
    {
      id: "sale-1",
      title: "Ab id cumque numquam.",
      price: "1758992",
      currency: "USD",
      area: 485,
      bedrooms: 2,
      bathrooms: 4,
      address: "Urbanización Tadeo Manjón 64",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "sale-2",
      title: "Ea fuga similique molest...",
      price: "3305866",
      currency: "USD",
      area: 464,
      bedrooms: 2,
      bathrooms: 3,
      address: "Glorieta de Carmelo Dorioso 52",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "sale-3",
      title: "Ipsa corporis odit in max...",
      price: "1338350",
      currency: "USD",
      area: 102,
      bedrooms: 6,
      bathrooms: 2,
      address: "Vial Evelia Simo 74 Piso 1",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "sale-4",
      title: "Cum alias dolores magni.",
      price: "3314790",
      currency: "$",
      area: 464,
      bedrooms: 1,
      bathrooms: 1,
      address: "Alameda de Eladio Sandoval 8",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "sale-5",
      title: "Provident necessitatibus...",
      price: "3352349",
      currency: "$",
      area: 395,
      bedrooms: 3,
      bathrooms: 2,
      address: "Pasadizo Carina Bernal 6 Piso 9",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "sale-6",
      title: "Aut earum cumque.",
      price: "4172624",
      currency: "$",
      area: 153,
      bedrooms: 4,
      bathrooms: 1,
      address: "C. de Maxi Araujo 247",
      images: [],
      operationType: "venta",
      isFeatured: true
    }
  ];

  // Datos mock para propiedades en alquiler
  const mockRentProperties: Property[] = [
    {
      id: "rent-1",
      title: "Departamento luminoso centro",
      price: "45000",
      currency: "$",
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      address: "Av. Libertador 1250",
      images: [],
      operationType: "alquiler",
      isFeatured: true
    },
    {
      id: "rent-2",
      title: "Casa con jardín amplio",
      price: "78000",
      currency: "$",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      address: "Barrio Residencial Norte",
      images: [],
      operationType: "alquiler",
      isFeatured: true
    },
    {
      id: "rent-3",
      title: "Loft moderno amoblado",
      price: "52000",
      currency: "$",
      area: 65,
      bedrooms: 1,
      bathrooms: 1,
      address: "Zona Universitaria 456",
      images: [],
      operationType: "alquiler",
      isFeatured: true
    },
    {
      id: "rent-4",
      title: "Ph con terraza exclusiva",
      price: "95000",
      currency: "$",
      area: 120,
      bedrooms: 2,
      bathrooms: 2,
      address: "Palermo Soho 789",
      images: [],
      operationType: "alquiler",
      isFeatured: true
    },
    {
      id: "rent-5",
      title: "Duplex en zona comercial",
      price: "65000",
      currency: "$",
      area: 95,
      bedrooms: 2,
      bathrooms: 1,
      address: "Microcentro 321",
      images: [],
      operationType: "alquiler",
      isFeatured: true
    },
    {
      id: "rent-6",
      title: "Monoambiente equipado",
      price: "35000",
      currency: "$",
      area: 42,
      bedrooms: 1,
      bathrooms: 1,
      address: "Recoleta 555",
      images: [],
      operationType: "alquiler",
      isFeatured: true
    }
  ];

  // Datos mock para terrenos y countries
  const mockLandProperties: Property[] = [
    {
      id: "land-1",
      title: "Terreno esquina en country",
      price: "2450000",
      currency: "USD",
      area: 850,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Las Praderas Lote 45",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "land-2",
      title: "Lote con vista al lago",
      price: "1890000",
      currency: "USD",
      area: 1200,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Cerrado Los Sauces",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "land-3",
      title: "Terreno plano para desarrollo",
      price: "3200000",
      currency: "USD",
      area: 2500,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona Norte Industrial",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "land-4",
      title: "Lote en barrio privado",
      price: "1650000",
      currency: "USD",
      area: 680,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Club Residencial",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "land-5",
      title: "Terreno con arboleda",
      price: "2100000",
      currency: "USD",
      area: 950,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Parque del Este",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "land-6",
      title: "Lote central urbanizado",
      price: "1420000",
      currency: "USD",
      area: 550,
      bedrooms: 0,
      bathrooms: 0,
      address: "Loteo Premium Fase 2",
      images: [],
      operationType: "venta",
      isFeatured: true
    }
  ];

  // Datos mock para emprendimientos
  const mockDevelopmentProperties: Property[] = [
    {
      id: "dev-1",
      title: "Torres Mirador - Unidades desde",
      price: "2850000",
      currency: "USD",
      area: 95,
      bedrooms: 2,
      bathrooms: 2,
      address: "Av. del Libertador 5600",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "dev-2",
      title: "Complejo Residencial Parque",
      price: "1950000",
      currency: "USD",
      area: 78,
      bedrooms: 2,
      bathrooms: 1,
      address: "Zona Norte - Entrega 2026",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "dev-3",
      title: "Edificio Boutique Centro",
      price: "3450000",
      currency: "USD",
      area: 115,
      bedrooms: 3,
      bathrooms: 2,
      address: "Microcentro - En pozo",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "dev-4",
      title: "Dúplex en desarrollo premium",
      price: "4200000",
      currency: "USD",
      area: 145,
      bedrooms: 3,
      bathrooms: 3,
      address: "Palermo Chico - Preventa",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "dev-5",
      title: "Monoambientes inversión",
      price: "1250000",
      currency: "USD",
      area: 45,
      bedrooms: 1,
      bathrooms: 1,
      address: "Belgrano R - Financiación",
      images: [],
      operationType: "venta",
      isFeatured: true
    },
    {
      id: "dev-6",
      title: "PH con amenities completos",
      price: "5800000",
      currency: "USD",
      area: 180,
      bedrooms: 4,
      bathrooms: 3,
      address: "Recoleta - Entrega 2025",
      images: [],
      operationType: "venta",
      isFeatured: true
    }
  ];

  // Datos mock para alquileres temporarios
  const mockTemporaryProperties: Property[] = [
    {
      id: "temp-1",
      title: "Depto temporario amoblado",
      price: "1200",
      currency: "USD",
      area: 55,
      bedrooms: 1,
      bathrooms: 1,
      address: "Puerto Madero - Por día",
      images: [],
      operationType: "temporario",
      isFeatured: true
    },
    {
      id: "temp-2",
      title: "Casa vacacional con piscina",
      price: "2500",
      currency: "USD",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      address: "Costa - Por semana",
      images: [],
      operationType: "temporario",
      isFeatured: true
    },
    {
      id: "temp-3",
      title: "Loft céntrico equipado",
      price: "950",
      currency: "USD",
      area: 48,
      bedrooms: 1,
      bathrooms: 1,
      address: "Microcentro - Por día",
      images: [],
      operationType: "temporario",
      isFeatured: true
    },
    {
      id: "temp-4",
      title: "Apart hotel con servicios",
      price: "1800",
      currency: "USD",
      area: 75,
      bedrooms: 2,
      bathrooms: 1,
      address: "Palermo - Por día",
      images: [],
      operationType: "temporario",
      isFeatured: true
    },
    {
      id: "temp-5",
      title: "Estudio ejecutivo moderno",
      price: "850",
      currency: "USD",
      area: 38,
      bedrooms: 1,
      bathrooms: 1,
      address: "Recoleta - Por día",
      images: [],
      operationType: "temporario",
      isFeatured: true
    },
    {
      id: "temp-6",
      title: "Suite con vista panorámica",
      price: "3200",
      currency: "USD",
      area: 120,
      bedrooms: 2,
      bathrooms: 2,
      address: "Nordelta - Por semana",
      images: [],
      operationType: "temporario",
      isFeatured: true
    }
  ];

  const { data: salePropertiesData } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=venta"],
  });
  const featuredSaleProperties = salePropertiesData?.length ? salePropertiesData : mockSaleProperties;

  const { data: rentPropertiesData } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=alquiler"],
  });
  const featuredRentProperties = rentPropertiesData?.length ? rentPropertiesData : mockRentProperties;

  const { data: landPropertiesData } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&category=terrenos"],
  });
  const featuredLandProperties = landPropertiesData?.length ? landPropertiesData : mockLandProperties;

  const { data: developmentsData } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&category=emprendimientos"],
  });
  const featuredDevelopments = developmentsData?.length ? developmentsData : mockDevelopmentProperties;

  const { data: temporaryPropertiesData } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured?limit=6&operationType=temporario"],
  });
  const featuredTemporaryProperties = temporaryPropertiesData?.length ? temporaryPropertiesData : mockTemporaryProperties;

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ["/api/locations"],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* header background (optional pt-28 || pt-[5.875rem]) */}
      <div className="">
        <HeroSearch />

        {/* Buttons Section */}
        {/* <section className="bg-white">
          <div className="container max-w-8xl mx-auto px-4">
            <div className="buttons-busqueda flex justify-center gap-2">
              <Link href="/inmobiliarias">
                <Button className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg">
                  Buscar por inmobiliaria
                </Button>
              </Link>
              <Link href="/mapa">
                <Button className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg">
                  Búsqueda por mapa
                </Button>
              </Link>
              <Link href="/busqueda-codigo">
                <Button className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg">
                  Búsqueda por código
                </Button>
              </Link>
              <Link href="/busqueda-valor">
                <Button className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg">
                  Búsqueda por valor
                </Button>
              </Link>
              <Link href="/aptas-creditos">
                <Button className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg">
                  Búsqueda aptas créditos
                </Button>
              </Link>
            </div>
          </div>
        </section> */}

      {/* Formularios de Acceso - Usuarios e Inmobiliarias */}
      {/* <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#ff2e06] text-white rounded-lg shadow-lg p-6 border border-white/20">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold mb-3">¿Buscás propiedades?</h3>
              <p className="text-sm leading-relaxed">BuscoInmuebles.click lo ayuda a buscar el inmueble que necesita ahorrándole tiempo, recibirá notificaciones en su mail y WhatsApp.</p>
            </div>
            
            <div className="space-y-3">
              <Link href="/solicitar-inmueble">
                <Button className="w-full h-11 bg-white text-[#ff2e06] hover:bg-red-50 font-semibold text-sm transition-colors">
                  Complete el formulario
                </Button>
              </Link>
              
              <Link href="/propiedades-guardadas">
                <Button variant="outline" 
                        className="w-full h-11 border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold text-sm transition-colors"
                >
                  Mis Favoritos
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-[#ff2e06] text-white rounded-lg shadow-lg p-6 border border-white/20">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold mb-3">¿Eres inmobiliaria?</h3>
              <p className="text-sm leading-relaxed">Buscoinmuebles.click lo ayuda a gestionar y publicar sus propiedades ahorrandole costos, recibirá notificaciones a su mail y WhatsApp.</p>
            </div>
            
            <div className="space-y-3">
              <Link href="/inmobiliarias">
                <Button className="w-full h-11 bg-white text-[#ff2e06] hover:bg-red-50 font-semibold text-sm transition-colors">
                  Complete el formulario
                </Button>
              </Link>
              
              <Link href="/registro-inmobiliaria">
                <Button variant="outline" 
                        className="w-full h-11 border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold text-sm transition-colors"
                >
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Banner superior */}
      {/* <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <AdBanner width={1200} height={150} />
        </div>
      </section> */}

      {/* Emprendimientos Destacados con Filtros */}
      <FeaturedDevelopmentsFilter
        properties={[
          ...mockSaleProperties,
          ...mockRentProperties,
          ...mockLandProperties,
          ...mockDevelopmentProperties,
          ...mockTemporaryProperties
        ]}
      />

      {/* Banners intermedios */}
      {/* <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section> */}

      {/* <FeaturedPropertiesSection
        title="Alquileres temporarios"
        properties={featuredTemporaryProperties}
        viewMoreLink="/properties?operationType=temporario"
      /> */}

      {/* Banners intermedios */}
      <section className="py-2 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section>

      {/* Banner inferior */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <AdBanner width={1200} height={250} />
        </div>
      </section>

      <LocationGrid locations={locations} />

      <Footer />
      </div>
    </div>
  );
}