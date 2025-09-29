import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23f1f5f9" fill-opacity="0.4"><circle cx="30" cy="30" r="1.5"/></g></svg>')`,
        backgroundSize: '60px 60px'
      }}></div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Viví donde siempre soñaste
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Con el respaldo de nuestro sector inmobiliario
          </p>
          
          {/* Operation Type Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-muted rounded-lg p-1">
              <button
                className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                  operationType === "venta"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setOperationType("venta")}
                data-testid="operation-venta"
              >
                VENTA
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                  operationType === "alquiler"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setOperationType("alquiler")}
                data-testid="operation-alquiler"
              >
                ALQUILER
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                  operationType === "temporario"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setOperationType("temporario")}
                data-testid="operation-temporario"
              >
                TEMPORARIO
              </button>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de propiedad
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger data-testid="property-type-select">
                    <SelectValue placeholder="Todas las propiedades" />
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
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Localidad
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger data-testid="location-select">
                    <SelectValue placeholder="Buscar por localidad..." />
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
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Búsqueda avanzada
                </label>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-muted-foreground"
                  data-testid="advanced-search"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Más filtros...
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={handleSearch}
                data-testid="search-button"
              >
                <Search className="h-5 w-5 mr-2" />
                Buscar
              </Button>
              <Link href="/properties">
                <Button 
                  variant="secondary" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
                  data-testid="search-by-agency"
                >
                  Buscar por inmobiliaria
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="font-semibold"
                data-testid="search-by-map"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Búsqueda por mapa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
