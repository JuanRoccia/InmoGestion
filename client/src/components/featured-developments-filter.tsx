import { useState } from 'react';
import { Button } from "./ui/button";
import PropertyCard from "./property-card";
import { cn } from "@/lib/utils";
import AdBanner from "./ui/AdBanner";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: string;
  priceNumber?: number;
  currency: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  images?: string[];
  operationType: string;
  developmentStatus?: string;
  isFeatured?: boolean;
  isCreditSuitable?: boolean;
  category?: string;
  categoryId?: string;
  propertyType?: string;
}

interface FeaturedDevelopmentsFilterProps {
  properties: Property[];
}

// Category IDs from database
const CATEGORY_IDS = {
  country: '83006202-b65f-44e2-a8fc-645eb08b27d4',
  campo: 'a5963624-27cc-4779-8eb8-a16a1e787b95',
};

const categories = [
  { id: 'venta', label: 'Venta' },
  { id: 'alquiler', label: 'Alquiler' },
  { id: 'temporarios', label: 'Temporarios' },
  { id: 'emprendimientos', label: 'Emprendimientos' },
  { id: 'countries', label: 'Countries-Barrios Cerrados' },
  { id: 'campos', label: 'Campos' },
];

const developmentStatuses = [
  { id: 'all', label: 'Todos' },
  { id: 'pozo', label: 'En Pozo' },
  { id: 'construccion', label: 'En Construcción' },
  { id: 'terminado', label: 'Terminado' },
];

export default function FeaturedDevelopmentsFilter({ properties }: FeaturedDevelopmentsFilterProps) {
  const [activeCategory, setActiveCategory] = useState('emprendimientos');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  // Filter: ONLY featured properties, then by category
  // Defensive check to ensure properties is an array
  const safeProperties = Array.isArray(properties) ? properties : [];
  const filteredProperties = safeProperties.filter(property => {
    // First: Must be featured
    if (!property.isFeatured) return false;

    // Then filter by active category
    let matchesCategory = false;
    switch (activeCategory) {
      case 'venta':
        // Venta: operationType venta, excluding emprendimientos/countries/campos
        matchesCategory = property.operationType === 'venta' &&
          !property.developmentStatus &&
          property.categoryId !== CATEGORY_IDS.country &&
          property.categoryId !== CATEGORY_IDS.campo;
        break;
      case 'alquiler':
        // Alquiler: exclude emprendimientos (those go only in emprendimientos tab)
        matchesCategory = property.operationType === 'alquiler' &&
          !property.developmentStatus &&
          property.categoryId !== CATEGORY_IDS.country &&
          property.categoryId !== CATEGORY_IDS.campo;
        break;
      case 'temporarios':
        // Temporarios: exclude emprendimientos
        matchesCategory = property.operationType === 'temporario' &&
          !property.developmentStatus &&
          property.categoryId !== CATEGORY_IDS.country &&
          property.categoryId !== CATEGORY_IDS.campo;
        break;
      case 'emprendimientos':
        // Emprendimientos: Has developmentStatus (pozo/construccion/terminado)
        matchesCategory = !!property.developmentStatus;
        break;
      case 'countries':
        matchesCategory = property.categoryId === CATEGORY_IDS.country;
        break;
      case 'campos':
        matchesCategory = property.categoryId === CATEGORY_IDS.campo;
        break;
      default:
        matchesCategory = true;
    }

    if (!matchesCategory) return false;

    // Sub-category filter for Emprendimientos
    if (activeCategory === 'emprendimientos' && activeSubCategory !== 'all') {
      return property.developmentStatus === activeSubCategory;
    }

    return true;
  });

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl text-foreground font-extralight mb-4">
          Propiedades destacadas
        </h2>

        {/* Filtros Principales */}
        <div className="flex flex-wrap gap-4 mb-4">
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setStartIndex(0); // Reset carousel position
                if (category.id !== 'emprendimientos') {
                  setActiveSubCategory('all');
                }
              }}
              className={cn(
                "px-6 py-2 rounded-full transition-colors",
                activeCategory === category.id
                  ? "bg-[#ff2e06] text-white hover:bg-[#e62905]"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Sub-filtros para Emprendimientos */}
        {activeCategory === 'emprendimientos' && (
          <div className="flex flex-wrap gap-2 mb-8 ml-4">
            {developmentStatuses.map(status => (
              <Button
                key={status.id}
                onClick={() => setActiveSubCategory(status.id)}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full text-xs h-8",
                  activeSubCategory === status.id
                    ? "bg-gray-800 text-white hover:bg-gray-700 border-gray-800"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                )}
              >
                {status.label}
              </Button>
            ))}
          </div>
        )}

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

        {/* Carousel con flechas */}
        <div className="relative">
          {/* Flecha izquierda */}
          {startIndex > 0 && (
            <button
              onClick={() => setStartIndex(Math.max(0, startIndex - itemsPerPage))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Grid de propiedades */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredProperties.slice(startIndex, startIndex + itemsPerPage).map((property) => (
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

          {/* Flecha derecha */}
          {startIndex + itemsPerPage < filteredProperties.length && (
            <button
              onClick={() => setStartIndex(startIndex + itemsPerPage)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}