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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'h-20 bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.2)]' 
        : 'h-[5.875rem] bg-white/70 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
    }`}>
      <div className="container relative mx-auto h-full">
        <nav className="h-full">
          <div className="flex items-center justify-between h-full px-6 md:px-8 lg:px-12">
            {/* Logo */}
            <div className="logo relative flex-shrink-0 p-3">
              <Link href="/">
                <img 
                  alt="Busco Inmueble.click" 
                  src="/assets/logo.png" 
                  className={`w-auto transition-all duration-300 ${
                    isScrolled ? 'h-16' : 'h-[6.0rem] py-3'
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

            {/* Navigation Menu Container - Ahora incluye nav links y social media */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1">
              {/* Main Navigation Links */}
              <nav className="flex items-center justify-center">
                <Link href="/" className="nav-link text-[#212121] hover:text-[#ff2e06] px-6 py-2 transition-colors text-base">
                  Inicio
                </Link>
                
                <span className="text-gray-300 text-xl px-4">|</span>
                
                <Link href="/properties" className="nav-link text-[#212121] hover:text-[#ff2e06] px-6 py-2 transition-colors text-base">
                  Categorías
                </Link>
                
                <span className="text-gray-300 text-xl px-4">|</span>
                
                <Link href="#" className="nav-link text-[#212121] hover:text-[#ff2e06] px-6 py-2 transition-colors text-base">
                  Calculadora
                </Link>
                
                <span className="text-gray-300 text-xl px-4">|</span>
                
                <Link href="/inmobiliarias" className="nav-link text-[#212121] hover:text-[#ff2e06] px-6 py-2 transition-colors text-base">
                  Inmobiliarias
                </Link>
                
                <span className="text-gray-300 text-xl px-4">|</span>
                
                <Link href="/contacto" className="nav-link text-[#212121] hover:text-[#ff2e06] px-6 py-2 transition-colors text-base">
                  Contacto
                </Link>
              </nav>

              {/* Social Media Links - Debajo del nav principal */}
              <div className={`transition-all duration-300 overflow-hidden mt-1 ${
                isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'
              }`}>
                <div className="flex items-center justify-center space-x-6">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-600 hover:text-[#ff2e06] text-sm font-medium transition-all duration-300 transform hover:scale-110"
                  >
                    <i className="text-base mr-1"></i>
                    Facebook
                  </a>
                  
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-600 hover:text-[#ff2e06] text-sm font-medium transition-all duration-300 transform hover:scale-110"
                  >
                    <i className="text-base mr-1"></i>
                    Instagram
                  </a>
                  
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-600 hover:text-[#ff2e06] text-sm font-medium transition-all duration-300 transform hover:scale-110"
                  >
                    <i className="text-base mr-1"></i>
                    Twitter
                  </a>
                  
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-600 hover:text-[#ff2e06] text-sm font-medium transition-all duration-300 transform hover:scale-110"
                  >
                    <i className="text-base mr-1"></i>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Auth Menu - Solo en la derecha */}
            <div className="hidden md:flex items-center justify-end flex-shrink-0">
              <AuthMenu />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}