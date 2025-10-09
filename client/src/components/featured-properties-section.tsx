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
    <section className={`py-8 px-4 sm:px-6 lg:px-8 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
          <Link href={viewMoreLink}>
            <a className="text-primary hover:text-primary/80 text-sm font-medium transition-colors" data-testid={`view-more-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              Ver más
            </a>
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 1,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {properties.map((property) => (
              <CarouselItem 
                key={property.id} 
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                data-testid={`carousel-item-${property.id}`}
              >
                <PropertyCard property={property} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12" data-testid="carousel-prev-button" />
          <CarouselNext className="hidden md:flex -right-4 lg:-right-12" data-testid="carousel-next-button" />
        </Carousel>
      </div>
    </section>
  );
}
