import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import AuthMenu from "@/components/auth-menu";

interface DashboardNavProps {
    agency: any;
}

export default function DashboardNav({ agency }: DashboardNavProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { label: "Suscripción al sistema", href: "/subscribe" },
        { label: "Tarifario Publicitario", href: "#" },
        { label: "Condiciones de publicación", href: "#" },
        { label: "Condiciones comerciales comunes", href: "#" },
        { label: "Términos y Condiciones", href: "/terms" },
        { label: "Tutorial", href: "#" },
    ];

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gray-100 ${isScrolled
                ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.2)] py-2'
                : 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] py-4'
                }`}>

                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Logo - Más pegado al borde */}
                        <div className="logo relative flex-shrink-0 pl-3">
                            <Link href="/">
                                <img
                                    alt="Busco Inmueble.click"
                                    src="/assets/logo.png"
                                    className={`w-auto transition-all duration-300 ${isScrolled ? 'h-16' : 'h-[6.0rem] py-3'
                                        }`}
                                />
                            </Link>
                        </div>
                        <div className={`transition-all duration-300 ${isScrolled ? 'scale-95 origin-left' : ''}`}>
                            <h1 className={`font-light text-gray-800 transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
                                Bienvenido inmobiliaria <span className="font-semibold text-primary">{agency?.name}</span>
                            </h1>
                            <p className={`text-muted-foreground mt-1 text-lg transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
                                Gestione sus propiedades y estadísticas
                            </p>
                        </div>

                        <div className="flex items-center gap-4 self-end md:self-auto">
                            <AuthMenu />

                            <Button
                                variant="outline"
                                className="gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                onClick={() => window.location.href = "/contacto"}
                            >
                                <Mail className="h-4 w-4" />
                                Contáctenos
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className={`w-full border-t border-gray-100 mt-4 transition-all duration-300`}>
                    <div className="container mx-auto px-4 md:px-8 overflow-x-auto">
                        <ul className="flex items-center justify-between min-w-max gap-4 text-sm font-medium text-gray-600 py-3">
                            {links.map((link, index) => (
                                <li key={index} className="flex items-center">
                                    <Link href={link.href} className="hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
                                        {link.label}
                                    </Link>
                                    {index < links.length - 1 && (
                                        <span className="ml-4 text-gray-300 select-none">|</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </header>

            {/* Spacer to compensate fixed header */}
            <div className={`transition-all duration-300 ${isScrolled ? 'h-[140px]' : 'h-[200px]'}`}></div>
        </>
    );
}
