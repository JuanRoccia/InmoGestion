import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";

import AdvancedSearchDialog from "@/components/advanced-search-dialog";

import SearchByCodeDialog from "@/components/search-by-code-dialog";
import SearchByValueDialog from "@/components/search-by-value-dialog";
import CreditSearchDialog from "@/components/credit-search-dialog";

export default function HeroSearch() {
  const [operationType, setOperationType] = useState("alquiler");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSearchByCodeOpen, setIsSearchByCodeOpen] = useState(false);
  const [isSearchByValueOpen, setIsSearchByValueOpen] = useState(false);
  const [isCreditSearchOpen, setIsCreditSearchOpen] = useState(false);

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (operationType && operationType !== "all") params.append("operationType", operationType);
    if (propertyType && propertyType !== "all") params.append("categoryId", propertyType);
    if (location && location !== "all") params.append("locationId", location);
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <section className="relative min-h-[100%] bg-cover bg-center pt-28" style={{
      backgroundImage: `url('/assets/banner_back_complete.jpg')`,
      backgroundPosition: 'top center'
    }}>
      {/* Overlay */}
      {/* optional filter (bg-black/20 bg-white/10) */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div className="relative container mx-auto px-0 py-2">

        {/* Top Section - CTA Box and Hero Text side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">

          {/* Call-to-Action Box - Top Left */}
          {/* <div className="lg:col-span-1">
            <div className="absolute top-4 mx-1 left-11 bg-[#ff2e06] text-white py-3 px-5 rounded-lg shadow-lg max-w-[20%] z-10 border border-white/100">
              <p className="text-xs mb-2 leading-tight">
                BuscoInmueble.click lo ayuda a buscar el inmueble que necesita ahorrándole tiempo, recibirá notificaciones en su mail y WhatsApp.
              </p>
              <button 
                type="button"
                className="w-full bg-white text-[#ff2e06] py-1 px-4 rounded font-medium text-xs hover:bg-red-100 transition-colors"
              >
                Complete el formulario
              </button>
            </div>
          </div> */}

          {/* Hero Text - Center Top */}
          {/* text-center text-white mb-8 pt-8 */}
          <div className="lg:col-span-3 text-center lg:text-center text-white self-center">
            <div className="">
              {/* text-4xl md:text-4xl */}
              <h1 className="text-[2.75rem] md:text-[2.50em] font-bold mb-1 [text-shadow:_1px_2px_4px_rgb(0_0_0_/_100%)]">
                Viví donde siempre soñaste
              </h1>
              <p className="text-lg md:text-xl drop-shadow-md leading-snug [text-shadow:_1px_1px_3px_rgb(0_0_0_/_100%)]">
                Con el respaldo de nuestro sector inmobiliario.
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-7xl mx-auto">
          {/* Operation Type Tabs */}
          <div className="flex gap-2 justify-center mb-0">
            <button
              className={`tracking-widest uppercase px-12 py-3 rounded-t-lg text-sm font-semibold transition-all ${operationType === "venta"
                ? "bg-white/90 text-[#ff2e06]"
                : "bg-white/55 text-gray-600 hover:bg-white/90"
                }`}
              onClick={() => setOperationType("venta")}
            >
              VENTA
            </button>
            <button
              className={`tracking-widest uppercase px-12 py-3 rounded-t-lg text-sm font-semibold transition-all ${operationType === "alquiler"
                ? "bg-white/90 text-[#ff2e06]"
                : "bg-white/55 text-gray-600 hover:bg-white/90"
                }`}
              onClick={() => setOperationType("alquiler")}
            >
              ALQUILER
            </button>
            <button
              className={`tracking-widest uppercase px-12 py-3 rounded-t-lg text-sm font-semibold transition-all ${operationType === "temporario"
                ? "bg-white/90 text-[#ff2e06]"
                : "bg-white/55 text-gray-600 hover:bg-white/90"
                }`}
              onClick={() => setOperationType("temporario")}
            >
              TEMPORARIO
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 rounded-lg shadow-xl px-10 py-7">
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              {/* Property Type */}
              <div className="flex-1">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="w-full h-12 border border-gray-300 rounded bg-white/85">
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las propiedades</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="flex-1 md:max-w-[250px]">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full h-12 border border-gray-300 rounded bg-white/85">
                    <SelectValue placeholder="Localidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las localidades</SelectItem>
                    {locations.map((loc: any) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Search Button */}
              <div className="md:w-auto">
                <Button
                  type="button"
                  onClick={() => setIsAdvancedOpen(true)}
                  variant="ghost"
                  className="w-full md:w-auto h-12 px-4 text-[#ff2e06] hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="text-xs leading-tight">
                    Búsqueda<br />avanzada
                  </span>
                </Button>
              </div>

              {/* Search Button */}
              <div className="md:w-auto">
                <Button
                  type="button"
                  onClick={handleSearch}
                  className="w-full md:w-auto h-12 px-8 bg-[#ff2e06] hover:bg-[#e62905] text-white flex items-center justify-center gap-2 font-semibold"
                  title="Buscar"
                >
                  <Search className="h-4 w-4" />
                  <span>Buscar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <AdvancedSearchDialog
          open={isAdvancedOpen}
          onOpenChange={setIsAdvancedOpen}
          initialFilters={{
            operationType,
            locationId: location,
            categoryId: propertyType
          }}
          locations={locations}
          categories={categories}
        />

        <SearchByCodeDialog
          open={isSearchByCodeOpen}
          onOpenChange={setIsSearchByCodeOpen}
        />

        <SearchByValueDialog
          open={isSearchByValueOpen}
          onOpenChange={setIsSearchByValueOpen}
        />

        <CreditSearchDialog
          open={isCreditSearchOpen}
          onOpenChange={setIsCreditSearchOpen}
        />

        {/* Buttons Section */}
        <section className="bg-white/0">
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
              <Button
                onClick={() => setIsSearchByCodeOpen(true)}
                className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg"
              >
                Búsqueda por código
              </Button>
              <Button
                onClick={() => setIsSearchByValueOpen(true)}
                className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg"
              >
                Búsqueda por valor
              </Button>
              <Button
                onClick={() => setIsCreditSearchOpen(true)}
                className="p-button p-component bg-[#ff2e06] hover:bg-[#e62905] text-white px-8 py-3 rounded-b-lg"
              >
                Búsqueda aptas créditos
              </Button>
            </div>
          </div>
        </section>

        {/* Formularios de Acceso - Usuarios e Inmobiliarias */}
        <section className="py-10 px-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulario para Usuarios */}
            <div className="bg-[#ff2e06] text-white rounded-lg shadow-lg p-6 border-2 border-white/100">
              <div className="text-center mb-4">
                {/* ¿Buscás propiedades? */}
                <h3 className="text-lg font-bold mb-2">Buscamos por Usted</h3>
                <p className="text-sm leading-relaxed">Sabemos que su tiempo es valioso. cuéntenos qué está buscando y nosotros nos ocupamos de encontrar la propiedad ideal para usted, entre todas las inmobiliarias que forman parte de <b>Buscoinmuebles</b>.</p>
              </div>

              <div className="space-y-3">
                <Link href="/solicitar-inmueble">
                  <Button className="w-full h-11 bg-white text-[#ff2e06] hover:bg-red-50 font-semibold text-sm transition-colors">
                    Ingresar
                  </Button>
                </Link>

                {/* <Link href="/propiedades-guardadas">
                  <Button variant="outline" 
                          className="w-full h-11 border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold text-sm transition-colors"
                  >
                    Mis Favoritos
                  </Button>
                </Link> */}
              </div>
            </div>

            {/* Formulario para Inmobiliarias */}
            <div className="bg-[#ff2e06] text-white rounded-lg shadow-lg p-6 border-2 border-white/100">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold mb-2">Propiedades Solicitadas</h3>
                <p className="text-sm leading-relaxed">Oportunidades reales de compra y alquiler que surgen de pedidos vigentes. Descubra la propiedades buscadas y participe de una operación directa con el respaldo profesional de <b>Buscoinmuebles</b>.</p>
              </div>

              <div className="space-y-3">
                <Link href="/inmobiliarias">
                  <Button className="w-full h-11 bg-white text-[#ff2e06] hover:bg-red-50 font-semibold text-sm transition-colors">
                    Ingresar
                  </Button>
                </Link>

                {/* <Link href="/registro-inmobiliaria">
                  <Button variant="outline" 
                          className="w-full h-11 border-2 border-white text-white bg-transparent hover:bg-white/10 font-semibold text-sm transition-colors"
                  >
                    Registrarse
                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}