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
            <div className="logo relative flex-shrink-0 p-2">
              <Link href="/">
                <img 
                  alt="Busco Inmueble.click" 
                  src="/assets/logo.png" 
                  className={`w-auto transition-all duration-300 ${
                    isScrolled ? 'h-14' : 'h-[5.9rem] py-4'
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
              <Link href="/" className="nav-link text-[#212121] hover:text-[#ff2e06] px-4 py-2 transition-colors">
                Inicio
              </Link>
              
              <span className="text-gray-300 text-xl">|</span>
              
              <Link href="/properties" className="nav-link text-[#212121] hover:text-[#ff2e06] px-4 py-2 transition-colors">
                Categorías
              </Link>
              
              <span className="text-gray-300 text-xl">|</span>
              
              <Link href="#" className="nav-link text-[#212121] hover:text-[#ff2e06] px-4 py-2 transition-colors">
                Calculadora
              </Link>
              
              <span className="text-gray-300 text-xl">|</span>
              
              <Link href="/inmobiliarias" className="nav-link text-[#212121] hover:text-[#ff2e06] px-4 py-2 transition-colors">
                Inmobiliarias
              </Link>
            </nav>

            {/* Social Media and Auth Menu Container */}
            <div className="hidden md:flex flex-col items-end justify-between flex-shrink-0">
              {/* Social Media Links - SE OCULTAN AL HACER SCROLL */}
              <div className={`transition-all duration-300 overflow-hidden ${
                isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100 mt-0 mb-2'
              }`}>
                <div className="flex items-center gap-1 pt-1">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-500 hover:text-[#ff2e06] px-2 py-1 text-sm font-light transition-colors"
                  >
                    Facebook
                  </a>
                  
                  <span className="text-gray-300 text-sm font-extralight">|</span>
                  
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-500 hover:text-[#ff2e06] px-2 py-1 text-sm font-light transition-colors"
                  >
                    Instagram
                  </a>
                  
                  <span className="text-gray-300 text-sm font-extralight">|</span>
                  
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-500 hover:text-[#ff2e06] px-2 py-1 text-sm font-light transition-colors"
                  >
                    Twitter
                  </a>
                  
                  <span className="text-gray-300 text-sm font-extralight">|</span>
                  
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="nav-link text-gray-500 hover:text-[#ff2e06] px-2 py-1 text-sm font-light transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              
              {/* Auth Menu - SIEMPRE VISIBLE */}
              <div className={`${
                isScrolled ? 'mb-1' : 'mb-3'
              } transition-all duration-300`}>
                <AuthMenu />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}