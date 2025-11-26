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
      isFeatured: true,
      category: "emprendimiento"
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
      isFeatured: true,
      category: "emprendimiento"
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
      isFeatured: true,
      category: "emprendimiento"
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
      isFeatured: true,
      category: "emprendimiento"
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
      isFeatured: true,
      category: "emprendimiento"
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
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-7",
      title: "Torres del Río - Vista al agua",
      price: "3200000",
      currency: "USD",
      area: 100,
      bedrooms: 2,
      bathrooms: 2,
      address: "Costanera - Entrega 2026",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-8",
      title: "Complejo Garden View",
      price: "2500000",
      currency: "USD",
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      address: "Barrio Jardín - Preventa",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-9",
      title: "Edificio Skyline",
      price: "4100000",
      currency: "USD",
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      address: "Centro Financiero - En obra",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-10",
      title: "Dúplex Premium Hills",
      price: "4800000",
      currency: "USD",
      area: 150,
      bedrooms: 3,
      bathrooms: 3,
      address: "Barrio Hills - Entrega 2027",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-11",
      title: "Estudio moderno centro",
      price: "950000",
      currency: "USD",
      area: 35,
      bedrooms: 1,
      bathrooms: 1,
      address: "Microcentro - Preventa rápida",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-12",
      title: "PH exclusivo terrazas",
      price: "6500000",
      currency: "USD",
      area: 200,
      bedrooms: 4,
      bathrooms: 4,
      address: "Recoleta Alta - Entrega 2025",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-13",
      title: "Torres Vista Parque",
      price: "2900000",
      currency: "USD",
      area: 105,
      bedrooms: 2,
      bathrooms: 2,
      address: "Parque Patricios - En construcción",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-14",
      title: "Complejo Familiar Norte",
      price: "2100000",
      currency: "USD",
      area: 80,
      bedrooms: 3,
      bathrooms: 2,
      address: "Zona Norte - Entrega 2026",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-15",
      title: "Edificio Corporativo",
      price: "3800000",
      currency: "USD",
      area: 130,
      bedrooms: 2,
      bathrooms: 2,
      address: "Barrio Empresarial - En pozo",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-16",
      title: "Dúplex Jardín Privado",
      price: "3500000",
      currency: "USD",
      area: 115,
      bedrooms: 3,
      bathrooms: 2,
      address: "Barrio Residencial - Preventa",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-17",
      title: "Monoambiente Smart",
      price: "850000",
      currency: "USD",
      area: 30,
      bedrooms: 1,
      bathrooms: 1,
      address: "Barrio Tecnológico - Entrega 2025",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-18",
      title: "PH duplex terraza",
      price: "5200000",
      currency: "USD",
      area: 170,
      bedrooms: 3,
      bathrooms: 3,
      address: "Palermo Hollywood - En obra",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-19",
      title: "Torres Puerto Madero",
      price: "4500000",
      currency: "USD",
      area: 140,
      bedrooms: 3,
      bathrooms: 2,
      address: "Puerto Madero - Entrega 2026",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-20",
      title: "Complejo Universitario",
      price: "1800000",
      currency: "USD",
      area: 70,
      bedrooms: 1,
      bathrooms: 1,
      address: "Cerca Universidad - Preventa",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-21",
      title: "Edificio Vista Ciudad",
      price: "3300000",
      currency: "USD",
      area: 110,
      bedrooms: 2,
      bathrooms: 2,
      address: "Centro Ciudad - En construcción",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-22",
      title: "Dúplex Familiar Moderno",
      price: "2800000",
      currency: "USD",
      area: 125,
      bedrooms: 3,
      bathrooms: 2,
      address: "Barrio Familiar - Entrega 2027",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-23",
      title: "Estudio Ejecutivo",
      price: "1100000",
      currency: "USD",
      area: 40,
      bedrooms: 1,
      bathrooms: 1,
      address: "Centro de Negocios - Preventa",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
    },
    {
      id: "dev-24",
      title: "PH penthouse exclusivo",
      price: "7500000",
      currency: "USD",
      area: 220,
      bedrooms: 4,
      bathrooms: 4,
      address: "Barrio Premium - Entrega 2025",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "emprendimiento"
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

  // Datos mock para countries
  const mockCountryProperties: Property[] = [
    {
      id: "country-1",
      title: "Casa en country exclusivo",
      price: "4500000",
      currency: "USD",
      area: 300,
      bedrooms: 4,
      bathrooms: 3,
      address: "Country Las Delicias - Mz 12 Casa 5",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-2",
      title: "Terreno en barrio cerrado",
      price: "1800000",
      currency: "USD",
      area: 800,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Cerrado San Remo Lote 23",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-3",
      title: "Chalet familiar en country",
      price: "3200000",
      currency: "USD",
      area: 220,
      bedrooms: 3,
      bathrooms: 2,
      address: "Country El Paraíso - Casa 8",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-4",
      title: "Lote premium en country",
      price: "2500000",
      currency: "USD",
      area: 1000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Los Lagos Lote 15",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-5",
      title: "Casa moderna en barrio privado",
      price: "5200000",
      currency: "USD",
      area: 350,
      bedrooms: 5,
      bathrooms: 4,
      address: "Barrio Cerrado El Castillo Casa 3",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-6",
      title: "Terreno esquina en country",
      price: "2100000",
      currency: "USD",
      area: 900,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Los Pinos Lote Esquina",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-7",
      title: "Casa estilo mediterráneo",
      price: "3800000",
      currency: "USD",
      area: 280,
      bedrooms: 4,
      bathrooms: 3,
      address: "Country Las Flores - Mz 8 Casa 1",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-8",
      title: "Terreno para construcción",
      price: "1650000",
      currency: "USD",
      area: 750,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Cerrado El Bosque Lote 45",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-9",
      title: "Duplex en country",
      price: "2900000",
      currency: "USD",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      address: "Country Vista Al Mar - Duplex B",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-10",
      title: "Lote interno en barrio privado",
      price: "1450000",
      currency: "USD",
      area: 600,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio El Prado Lote Interior 12",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-11",
      title: "Casa con pileta y quincho",
      price: "4100000",
      currency: "USD",
      area: 320,
      bedrooms: 4,
      bathrooms: 4,
      address: "Country Los Olivos - Casa 7",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-12",
      title: "Terreno grande en country",
      price: "2800000",
      currency: "USD",
      area: 1200,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country El Mirador Lote Grande 3",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-13",
      title: "Chalet de montaña",
      price: "3500000",
      currency: "USD",
      area: 250,
      bedrooms: 3,
      bathrooms: 3,
      address: "Country Sierra Alta - Chalet 2",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-14",
      title: "Lote esquina premium",
      price: "2200000",
      currency: "USD",
      area: 850,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Cerrado Las Quintas Lote Esquina",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-15",
      title: "Casa estilo rústico",
      price: "2950000",
      currency: "USD",
      area: 200,
      bedrooms: 3,
      bathrooms: 2,
      address: "Country El Rancho - Casa 4",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-16",
      title: "Terreno para emprendimiento",
      price: "1900000",
      currency: "USD",
      area: 900,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Nuevo Horizonte Lote 18",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-17",
      title: "Penthouse en country",
      price: "4800000",
      currency: "USD",
      area: 260,
      bedrooms: 4,
      bathrooms: 3,
      address: "Country Sky View - Penthouse 1",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-18",
      title: "Lote pequeño familiar",
      price: "1200000",
      currency: "USD",
      area: 500,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Cerrado Familia Lote 7",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-19",
      title: "Casa con vista al lago",
      price: "5500000",
      currency: "USD",
      area: 400,
      bedrooms: 5,
      bathrooms: 4,
      address: "Country Laguna Azul - Casa Vista Lago",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-20",
      title: "Terreno en altura",
      price: "1750000",
      currency: "USD",
      area: 700,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Las Alturas Lote 22",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-21",
      title: "Casa minimalista moderna",
      price: "3200000",
      currency: "USD",
      area: 180,
      bedrooms: 3,
      bathrooms: 2,
      address: "Country Diseño Urbano - Casa 3",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-22",
      title: "Lote familiar en esquina",
      price: "2300000",
      currency: "USD",
      area: 950,
      bedrooms: 0,
      bathrooms: 0,
      address: "Barrio Cerrado Familia Grande Lote Esquina",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-23",
      title: "Casa con amenities completos",
      price: "6200000",
      currency: "USD",
      area: 450,
      bedrooms: 6,
      bathrooms: 5,
      address: "Country Luxury Life - Casa Premium",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-24",
      title: "Terreno para proyecto",
      price: "1550000",
      currency: "USD",
      area: 650,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Futuro Lote 14",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-25",
      title: "Duplex moderno",
      price: "2600000",
      currency: "USD",
      area: 160,
      bedrooms: 2,
      bathrooms: 2,
      address: "Country Urban Style - Duplex A",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-26",
      title: "Lote con árboles frutales",
      price: "1850000",
      currency: "USD",
      area: 780,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Los Frutales Lote 9",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    },
    {
      id: "country-27",
      title: "Casa estilo provenzal",
      price: "3400000",
      currency: "USD",
      area: 240,
      bedrooms: 4,
      bathrooms: 3,
      address: "Country Provenza - Casa 5",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-28",
      title: "Terreno en zona tranquila",
      price: "1650000",
      currency: "USD",
      area: 680,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Paz y Silencio Lote 31",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-29",
      title: "Casa con jardín amplio",
      price: "3900000",
      currency: "USD",
      area: 290,
      bedrooms: 4,
      bathrooms: 3,
      address: "Country El Jardín - Casa 2",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "country"
    },
    {
      id: "country-30",
      title: "Lote premium con servicios",
      price: "2400000",
      currency: "USD",
      area: 880,
      bedrooms: 0,
      bathrooms: 0,
      address: "Country Los Servicios Lote Premium",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "barrio-cerrado"
    }
  ];

  // Datos mock para campo
  const mockCampoProperties: Property[] = [
    {
      id: "campo-1",
      title: "Estancia productiva",
      price: "12000000",
      currency: "USD",
      area: 500000,
      bedrooms: 6,
      bathrooms: 4,
      address: "Ruta 3 km 45 - Partido de Olavarría",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-2",
      title: "Campo con casa principal",
      price: "8500000",
      currency: "USD",
      area: 300000,
      bedrooms: 4,
      bathrooms: 3,
      address: "Ruta 226 - Entre Bahía Blanca y Tres Arroyos",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-3",
      title: "Parcela agrícola",
      price: "3500000",
      currency: "USD",
      area: 150000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Acceso a ruta 3 - Zona productiva",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-4",
      title: "Campo ganadero",
      price: "6800000",
      currency: "USD",
      area: 250000,
      bedrooms: 3,
      bathrooms: 2,
      address: "Ruta 73 - Buena zona de cría",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-5",
      title: "Chacra productiva",
      price: "4200000",
      currency: "USD",
      area: 200000,
      bedrooms: 2,
      bathrooms: 2,
      address: "Zona de secano - Buen potencial",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-6",
      title: "Campo con laguna",
      price: "7500000",
      currency: "USD",
      area: 400000,
      bedrooms: 4,
      bathrooms: 3,
      address: "Ruta 226 - Aguada permanente",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-7",
      title: "Estancia ganadera completa",
      price: "15000000",
      currency: "USD",
      area: 600000,
      bedrooms: 8,
      bathrooms: 5,
      address: "Ruta 226 - Estancia San Carlos",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-8",
      title: "Campo agrícola extensivo",
      price: "5200000",
      currency: "USD",
      area: 180000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona pampeana - Ruta 3",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-9",
      title: "Chacra con casa de familia",
      price: "2800000",
      currency: "USD",
      area: 120000,
      bedrooms: 3,
      bathrooms: 2,
      address: "Ruta 51 - Chacra La Familia",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-10",
      title: "Campo mixto (agrícola y ganadero)",
      price: "6500000",
      currency: "USD",
      area: 220000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Ruta 226 - Campo Mixto San Martín",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-11",
      title: "Estancia de elite",
      price: "18000000",
      currency: "USD",
      area: 800000,
      bedrooms: 10,
      bathrooms: 6,
      address: "Ruta 3 - Estancia Los Compadres",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-12",
      title: "Parcela para cultivo de soja",
      price: "2900000",
      currency: "USD",
      area: 100000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona soja - Ruta 15",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-13",
      title: "Campo con bosque nativo",
      price: "4800000",
      currency: "USD",
      area: 160000,
      bedrooms: 2,
      bathrooms: 2,
      address: "Ruta 226 - Campo Bosque El Sauce",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-14",
      title: "Chacra de trigo y maíz",
      price: "3200000",
      currency: "USD",
      area: 140000,
      bedrooms: 2,
      bathrooms: 2,
      address: "Zona cerealera - Ruta 188",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-15",
      title: "Campo con corrales",
      price: "5800000",
      currency: "USD",
      area: 200000,
      bedrooms: 3,
      bathrooms: 2,
      address: "Ruta 73 - Campo Ganadero El Corral",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-16",
      title: "Estancia para eventos",
      price: "14000000",
      currency: "USD",
      area: 500000,
      bedrooms: 6,
      bathrooms: 4,
      address: "Ruta 3 - Estancia Eventos",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-17",
      title: "Parcela para forestación",
      price: "2100000",
      currency: "USD",
      area: 80000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona forestal - Ruta 12",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-18",
      title: "Chacra con huerta familiar",
      price: "2600000",
      currency: "USD",
      area: 110000,
      bedrooms: 3,
      bathrooms: 2,
      address: "Ruta 51 - Chacra La Huerta",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-19",
      title: "Campo de cría de ganado",
      price: "7200000",
      currency: "USD",
      area: 280000,
      bedrooms: 4,
      bathrooms: 3,
      address: "Ruta 226 - Campo Cría Ganado",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-20",
      title: "Estancia vacacional",
      price: "11000000",
      currency: "USD",
      area: 450000,
      bedrooms: 5,
      bathrooms: 4,
      address: "Ruta 3 - Estancia Vacaciones",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-21",
      title: "Parcela para cultivo de girasol",
      price: "2400000",
      currency: "USD",
      area: 90000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona girasol - Ruta 20",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-22",
      title: "Campo con casa de huéspedes",
      price: "5500000",
      currency: "USD",
      area: 190000,
      bedrooms: 4,
      bathrooms: 3,
      address: "Ruta 226 - Campo Casa Huéspedes",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-23",
      title: "Chacra con molino antiguo",
      price: "3100000",
      currency: "USD",
      area: 130000,
      bedrooms: 2,
      bathrooms: 2,
      address: "Ruta 51 - Chacra El Molino",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-24",
      title: "Campo para cultivo orgánico",
      price: "3800000",
      currency: "USD",
      area: 150000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona orgánica - Ruta 17",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-25",
      title: "Estancia equina",
      price: "9500000",
      currency: "USD",
      area: 350000,
      bedrooms: 4,
      bathrooms: 3,
      address: "Ruta 3 - Estancia Caballo",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-26",
      title: "Parcela para pasturas",
      price: "1800000",
      currency: "USD",
      area: 70000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona pasturas - Ruta 19",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-27",
      title: "Campo con sistema de riego",
      price: "6200000",
      currency: "USD",
      area: 210000,
      bedrooms: 3,
      bathrooms: 2,
      address: "Ruta 226 - Campo Riego Automático",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-28",
      title: "Chacra con corral de animales",
      price: "2900000",
      currency: "USD",
      area: 120000,
      bedrooms: 3,
      bathrooms: 2,
      address: "Ruta 51 - Chacra El Corral",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-29",
      title: "Campo para cultivo de maíz",
      price: "3400000",
      currency: "USD",
      area: 140000,
      bedrooms: 0,
      bathrooms: 0,
      address: "Zona maíz - Ruta 22",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
    },
    {
      id: "campo-30",
      title: "Estancia para pesca y caza",
      price: "8800000",
      currency: "USD",
      area: 300000,
      bedrooms: 5,
      bathrooms: 4,
      address: "Ruta 3 - Estancia Pesca y Caza",
      images: [],
      operationType: "venta",
      isFeatured: true,
      category: "campo"
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

      {/* Banners intermedios */}
      <section className="pt-8 px-4 pb-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdBanner width={590} height={150} />
          <AdBanner width={590} height={150} />
        </div>
      </section>

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
          ...mockTemporaryProperties,
          ...mockCountryProperties,
          ...mockCampoProperties
        ]}
      />

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
      <section className="py-4 pb-0 px-4">
        <div className="max-w-7xl mx-auto">
          <AdBanner width={1200} height={250} />
        </div>
      </section>

      <LocationGrid locations={locations} />

      {/* <Footer /> */}
      <FooterInmo />
      </div>
    </div>
  );
}