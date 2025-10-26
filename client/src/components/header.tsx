import { Link } from "wouter";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthMenu from "@/components/auth-menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header with dynamic styles based on scroll position (static original option h-28)
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'h-20 bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.2)]' 
        : 'h-[4.875rem] bg-white/70 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
    }`}>
      <div className="container relative mx-auto h-full">
        <nav className="h-full">
          <div className="flex items-center justify-between h-full px-6 md:px-8 lg:px-12">
            {/* Logo */}
            <div className="logo relative flex-shrink-0">
              <Link href="/">
                <img 
                  alt="Busco Inmueble.click" 
                  src="/assets/logo.png" 
                  className={`w-auto transition-all duration-300 ${
                    isScrolled ? 'h-12' : 'h-12'
                  }`} 
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <Button variant="ghost" title="Menu" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              <Link href="/" className="nav-link text-[#212121] hover:text-[#FF5733] px-4 py-2 transition-colors">
                Inicio
              </Link>
              
              <span className="text-gray-300 text-xl">|</span>
              
              <Link href="/properties" className="nav-link text-[#212121] hover:text-[#FF5733] px-4 py-2 transition-colors">
                Categorías
              </Link>
              
              <span className="text-gray-300 text-xl">|</span>
              
              <Link href="#" className="nav-link text-[#212121] hover:text-[#FF5733] px-4 py-2 transition-colors">
                Calculadora
              </Link>
              
              <span className="text-gray-300 text-xl">|</span>
              
              <Link href="/contacto" className="nav-link text-[#212121] hover:text-[#FF5733] px-4 py-2 transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Auth Menu */}
            <nav className="hidden md:flex items-center flex-shrink-0">
              <AuthMenu />
            </nav>
          </div>
        </nav>
      </div>
    </header>
  );
}