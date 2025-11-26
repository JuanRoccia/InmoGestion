import { useState } from 'react';
import { Button } from "./ui/button";
import PropertyCard from "./property-card";
import { cn } from "@/lib/utils";
import AdBanner from "./ui/AdBanner";
import { Link } from "wouter";

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

interface FeaturedDevelopmentsFilterProps {
  properties: Property[];
}

const categories = [
  { id: 'venta', label: 'Venta' },
  { id: 'alquiler', label: 'Alquiler' },
  { id: 'temporarios', label: 'Temporarios' },
  { id: 'emprendimientos', label: 'Emprendimientos' },
  { id: 'countries', label: 'Countries-Barrios Cerrados' },
  { id: 'campos', label: 'Campos' },
];

export default function FeaturedDevelopmentsFilter({ properties }: FeaturedDevelopmentsFilterProps) {
  const [activeCategory, setActiveCategory] = useState('emprendimientos');

  // Mapeo de categorías a tipos de propiedades
  const filteredProperties = properties.filter(property => {
    switch (activeCategory) {
      case 'venta':
        return property.operationType === 'venta' && 
               (!property.category || 
                !['emprendimiento', 'country', 'barrio-cerrado', 'campo'].includes(property.category));
      case 'alquiler':
        return property.operationType === 'alquiler';
      case 'temporarios':
        return property.operationType === 'temporario';
      case 'emprendimientos':
        return property.category === 'emprendimiento' || 
               property.propertyType === 'emprendimiento';
      case 'countries':
        return property.category === 'country' || 
               property.category === 'barrio-cerrado' || 
               property.propertyType === 'country';
      case 'campos':
        return property.category === 'campo' || 
               property.propertyType === 'campo';
      default:
        return true;
    }
  });

  // Debug logs
  if (activeCategory === 'emprendimientos') {
    console.log('Emprendimientos filter debug:');
    console.log('Total properties:', properties.length);
    console.log('Filtered properties:', filteredProperties.length);
    console.log('First 3 emprendimientos:', filteredProperties.slice(0, 3).map(p => ({ id: p.id, title: p.title, category: p.category })));
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl text-foreground font-extralight mb-4">
          Propiedades destacadas
        </h2>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-6 py-2 rounded-full transition-colors",
                activeCategory === category.id
                  ? "bg-[#ff2e06] text-white hover:bg-[#e62905]"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {category.label}
              {category.id === activeCategory && filteredProperties.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {filteredProperties.length}
                </span>
              )}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
          {filteredProperties.length > 6 && (
            <Link href={`/properties?category=${activeCategory}`} className="text-primary hover:text-primary/80 text-sm font-medium">
              Ver todas
            </Link>
          )}
        </div>

        {/* Grid de propiedades */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredProperties.slice(0, 6).map((property) => (
            <div key={property.id} className="w-full">
              <PropertyCard property={property} />
            </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No hay propiedades disponibles en esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}