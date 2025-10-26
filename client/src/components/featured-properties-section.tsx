import { Link } from "wouter";
import PropertyCard from "./property-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Property {
  id: string;
  title: string;
  price: string;
  currency: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  address: string;
  images?: string[];
  operationType: string;
  isFeatured?: boolean;
}

interface FeaturedPropertiesSectionProps {
  title: string;
  properties: Property[];
  viewMoreLink: string;
  bgClass?: string;
}

export default function FeaturedPropertiesSection({
  title,
  properties,
  viewMoreLink,
  bgClass = "",
}: FeaturedPropertiesSectionProps) {
  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl text-foreground">
            {title}
          </h2>
          <Link 
            href={viewMoreLink} 
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors" 
            data-testid={`view-more-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Ver más
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 1,
            dragFree: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {properties.map((property) => (
              <CarouselItem 
                key={property.id} 
                className="pl-4 pb-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                data-testid={`carousel-item-${property.id}`}
              >
                <PropertyCard property={property} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-4 xl:-left-12" data-testid="carousel-prev-button" />
          <CarouselNext className="hidden lg:flex -right-4 xl:-right-12" data-testid="carousel-next-button" />
        </Carousel>
      </div>
    </section>
  );
}
