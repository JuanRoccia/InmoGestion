import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    operationType: string;
    locationId: string;
    categoryId: string;
    limit: number;
    offset: number;
  };
  onFiltersChange: (filters: any) => void;
  locations: Array<{
    id: string;
    name: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  locations,
  categories,
}: SearchFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      offset: 0, // Reset offset when filters change
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      operationType: "all",
      locationId: "all",
      categoryId: "all",
      limit: 12,
      offset: 0,
    });
  };

  const hasActiveFilters = (filters.operationType && filters.operationType !== "all") || 
    (filters.locationId && filters.locationId !== "all") || 
    (filters.categoryId && filters.categoryId !== "all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <SlidersHorizontal className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
            data-testid="clear-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Filtros activos:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.operationType && (
              <Badge variant="secondary" className="flex items-center gap-1" data-testid="active-operation-filter">
                {filters.operationType}
                <button
                  onClick={() => updateFilter("operationType", "")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.locationId && (
              <Badge variant="secondary" className="flex items-center gap-1" data-testid="active-location-filter">
                {locations.find(l => l.id === filters.locationId)?.name || "Ubicación"}
                <button
                  onClick={() => updateFilter("locationId", "")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.categoryId && (
              <Badge variant="secondary" className="flex items-center gap-1" data-testid="active-category-filter">
                {categories.find(c => c.id === filters.categoryId)?.name || "Categoría"}
                <button
                  onClick={() => updateFilter("categoryId", "")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Operation Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tipo de Operación</Label>
        <Select value={filters.operationType} onValueChange={(value) => updateFilter("operationType", value)}>
          <SelectTrigger data-testid="filter-operation-type">
            <SelectValue placeholder="Todas las operaciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las operaciones</SelectItem>
            <SelectItem value="venta">Venta</SelectItem>
            <SelectItem value="alquiler">Alquiler</SelectItem>
            <SelectItem value="temporario">Temporario</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Localidad</Label>
        <Select value={filters.locationId} onValueChange={(value) => updateFilter("locationId", value)}>
          <SelectTrigger data-testid="filter-location">
            <SelectValue placeholder="Todas las localidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las localidades</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Tipo de Propiedad</Label>
        <Select value={filters.categoryId} onValueChange={(value) => updateFilter("categoryId", value)}>
          <SelectTrigger data-testid="filter-category">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rango de Precio</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Mín"
            className="text-sm"
            data-testid="filter-price-min"
          />
          <Input
            type="number"
            placeholder="Máx"
            className="text-sm"
            data-testid="filter-price-max"
          />
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Características</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" data-testid="filter-featured" />
            <Label htmlFor="featured" className="text-sm">Solo destacadas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="images" data-testid="filter-with-images" />
            <Label htmlFor="images" className="text-sm">Con imágenes</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Area Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Superficie (m²)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Mín m²"
            className="text-sm"
            data-testid="filter-area-min"
          />
          <Input
            type="number"
            placeholder="Máx m²"
            className="text-sm"
            data-testid="filter-area-max"
          />
        </div>
      </div>

      <Separator />

      {/* Rooms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Dormitorios</Label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0"
              data-testid={`filter-bedrooms-${num}`}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0"
            data-testid="filter-bedrooms-5plus"
          >
            5+
          </Button>
        </div>
      </div>

      <Separator />

      {/* Bathrooms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Baños</Label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className="w-10 h-10 p-0"
              data-testid={`filter-bathrooms-${num}`}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0"
            data-testid="filter-bathrooms-4plus"
          >
            4+
          </Button>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button className="w-full" data-testid="apply-filters">
        <Search className="h-4 w-4 mr-2" />
        Aplicar Filtros
      </Button>
    </div>
  );
}
