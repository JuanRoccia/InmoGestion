import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
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
    <section className="form-filter-container">
      {/* Call-to-Action Box */}
      <div className="cta-box">
        <p>
          BuscoInmueble.click lo ayuda a buscar el inmueble que necesita ahorrándole tiempo, recibirá notificaciones en su mail y WhatsApp.
        </p>
        <button type="button">
          Complete el formulario
        </button>
      </div>

      <div className="container py-5">
        {/* Hero Text */}
        <div className="home-text">
          <h2>Viví donde siempre soñaste</h2>
          <p>Con el respaldo de nuestro sector inmobiliario.</p>
        </div>

        {/* Form Filter */}
        <div className="pb-4">
          <div className="form-filter pt-2">
            {/* Operation Type Tabs */}
            <ul className="flex tabs gap-2 pb-0 justify-center w-full mb-4">
              <li>
                <button
                  className={`uppercase px-4 py-2 rounded text-sm font-medium transition-colors ${
                    operationType === "venta"
                      ? "bg-[#FF5733] text-white"
                      : "bg-white text-[#FF5733] hover:bg-gray-100"
                  }`}
                  onClick={() => setOperationType("venta")}
                >
                  Venta
                </button>
              </li>
              <li>
                <button
                  className={`uppercase px-4 py-2 rounded text-sm font-medium transition-colors ${
                    operationType === "alquiler"
                      ? "bg-[#FF5733] text-white"
                      : "bg-white text-[#FF5733] hover:bg-gray-100"
                  }`}
                  onClick={() => setOperationType("alquiler")}
                >
                  Alquiler
                </button>
              </li>
              <li>
                <button
                  className={`uppercase px-4 py-2 rounded text-sm font-medium transition-colors ${
                    operationType === "temporario"
                      ? "bg-[#FF5733] text-white"
                      : "bg-white text-[#FF5733] hover:bg-gray-100"
                  }`}
                  onClick={() => setOperationType("temporario")}
                >
                  Temporario
                </button>
              </li>
            </ul>

            {/* Form Card */}
            <div className="card-form bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <div className="grid justify-content-evenly">
                  {/* Property Type - col-12 md:col (flexible) */}
                  <div className="col-12 md:col">
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="w-full h-12 border border-gray-300 rounded">
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

                  {/* Location - col-12 md:col-3 */}
                  <div className="col-12 md:col-3">
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full h-12 border border-gray-300 rounded">
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

                  {/* Advanced Search Button - col-12 md:col-1 */}
                  <div className="col-12 md:col-1">
                    <Button 
                      type="button" 
                      className="w-full advanced-btn p-button-link p-button p-component h-12 flex flex-col items-center justify-center"
                    >
                      <span className="p-button-icon">
                        <Filter className="h-4 w-4 mb-1" />
                      </span>
                      <span className="p-button-label">
                        Búsqueda <br /> avanzada
                      </span>
                    </Button>
                  </div>

                  {/* Search Button - col-12 md:col-2 */}
                  <div className="col-12 md:col-2">
                    <Button 
                      type="submit" 
                      className="w-full submit-simple p-button p-component h-12 flex items-center justify-center gap-2"
                      title="Buscar"
                    >
                      <span className="p-button-icon">
                        <Search className="h-4 w-4" />
                      </span>
                      <span className="p-button-label">Buscar</span>
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
