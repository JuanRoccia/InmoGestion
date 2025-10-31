import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";

export default function HeroSearch() {
  const [operationType, setOperationType] = useState("venta");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations"],
  });

  const { data: categories = [] } = useQuery({
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
    <section className="relative min-h-[400px] bg-cover bg-center" style={{
      backgroundImage: `url('/assets/banner_back.jpg')`,
      backgroundPosition: 'center center'
    }}>
      {/* Overlay */}
      {/* optional filter (bg-black/20 bg-white/10) */}
      <div className="absolute inset-0"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-0 py-12">
        
        {/* Top Section - CTA Box and Hero Text side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
          
          {/* Call-to-Action Box - Top Left */}
          <div className="lg:col-span-1">
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
          </div>

          {/* Hero Text - Center Top */}
          {/* text-center text-white mb-8 pt-8 */}
          <div className="lg:col-span-3 text-center lg:text-center text-white self-center">
            <div className="">
              <h2 className="text-4xl md:text-4xl font-bold mb-2 [text-shadow:_1px_2px_4px_rgb(0_0_0_/_100%)]">
                Viví donde siempre soñaste
              </h2>
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
              className={`tracking-widest uppercase px-12 py-3 rounded-t-lg text-sm font-semibold transition-all ${
                operationType === "venta"
                  ? "bg-white/90 text-[#ff2e06]"
                  : "bg-white/55 text-gray-600 hover:bg-white/90"
              }`}
              onClick={() => setOperationType("venta")}
            >
              VENTA
            </button>
            <button
              className={`tracking-widest uppercase px-12 py-3 rounded-t-lg text-sm font-semibold transition-all ${
                operationType === "alquiler"
                  ? "bg-white/90 text-[#ff2e06]"
                  : "bg-white/55 text-gray-600 hover:bg-white/90"
              }`}
              onClick={() => setOperationType("alquiler")}
            >
              ALQUILER
            </button>
            <button
              className={`tracking-widest uppercase px-12 py-3 rounded-t-lg text-sm font-semibold transition-all ${
                operationType === "temporario"
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
      </div>
    </section>
  );
}