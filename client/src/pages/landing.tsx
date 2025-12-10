import Header from "@/components/header";
import HeroSearch from "@/components/hero-search";
import Footer from "@/components/ui/footer";
import FeaturedDevelopmentsFilter from "../components/featured-developments-filter";
import LocationGrid from "@/components/location-grid";
import SubscriptionPlans from "@/components/subscription-plans";
import TutorialOverlay from "@/components/tutorial-overlay";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SectionTitle from "@/components/ui/SectionTitle";
import AdBanner from "@/components/ui/AdBanner";
import FooterInmo from "@/components/footer-inmo";

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
  category?: string;
  propertyType?: string;
  developmentStatus?: string;
}

export default function Landing() {
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties?isFeatured=true&limit=100"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <FooterInmo />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* header background (optional pt-28 || pt-[5.875rem]) */}
      <main className="flex-1">
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

        {/* Banners intermedios */}
        <section className="pt-8 px-4 pb-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdBanner width={590} height={150} />
            <AdBanner width={590} height={150} />
          </div>
        </section>

        {/* Propiedades Destacadas */}
        <FeaturedDevelopmentsFilter properties={properties} />

        <section className="pt-8 px-4">
          <div className="max-w-7xl mx-auto">
            <AdBanner width={1200} height={150} className="mx-auto" />
          </div>
        </section>

        <LocationGrid />

        {/* <SubscriptionPlans /> */}

        {/* <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">¿Sos Inmobiliaria o Constructora?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sumate a la plataforma líder y publicá tus propiedades. Gestioná tu inventario y llegá a más clientes.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth">
                <Button size="lg">Comenzar Ahora</Button>
              </Link>
            </div>
          </div>
        </section> */}
      </main>

      <FooterInmo />
      <TutorialOverlay />
    </div>
  );
}