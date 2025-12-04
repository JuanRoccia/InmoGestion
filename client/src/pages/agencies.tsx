import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer-inmo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Agencies() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: agencies = [], isLoading } = useQuery({
        queryKey: ["/api/agencies", searchTerm],
        queryFn: async () => {
            const url = searchTerm
                ? `/api/agencies?search=${encodeURIComponent(searchTerm)}`
                : "/api/agencies";
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch agencies");
            return res.json();
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 pt-28">
                <div className="max-w-4xl mx-auto mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Inmobiliarias</h1>
                    <p className="text-gray-600 mb-8">
                        Encuentra las mejores inmobiliarias y agentes de la zona
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Buscar inmobiliaria por nombre..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="h-32 bg-gray-200 animate-pulse" />
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : agencies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agencies.map((agency: any) => (
                            <Card key={agency.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                                <div className="h-32 bg-gray-100 flex items-center justify-center p-4">
                                    {agency.logo ? (
                                        <img
                                            src={agency.logo}
                                            alt={agency.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-4xl font-bold text-gray-300">
                                            {agency.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-xl text-center">{agency.name}</CardTitle>
                                </CardHeader>

                                <CardContent className="flex-grow space-y-3 text-sm text-gray-600">
                                    {agency.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                                            <span>{agency.address}</span>
                                        </div>
                                    )}

                                    {agency.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                            <span>{agency.phone}</span>
                                        </div>
                                    )}

                                    {agency.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 flex-shrink-0" />
                                            <a href={`mailto:${agency.email}`} className="hover:text-primary truncate">
                                                {agency.email}
                                            </a>
                                        </div>
                                    )}

                                    {agency.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 flex-shrink-0" />
                                            <a
                                                href={agency.website.startsWith('http') ? agency.website : `https://${agency.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary truncate"
                                            >
                                                Visitar sitio web
                                            </a>
                                        </div>
                                    )}

                                    <div className="pt-4 mt-auto">
                                        <Link href={`/properties?agencyId=${agency.id}`}>
                                            <Button className="w-full bg-[#ff2e06] hover:bg-[#e62905]">
                                                Ver Propiedades
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No se encontraron inmobiliarias</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
