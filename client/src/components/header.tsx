import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User, LogOut, Building2, Settings, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
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
        : 'h-28 bg-white/70 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
    }`}>
      <div className="container relative mx-auto h-full">
        <nav className="h-full">
          <div className="grid grid-cols-12 items-center h-full">
            {/* Logo */}
            <div className="col-span-6 md:col-span-2 logo relative">
              <Link href="/">
                <img 
                  alt="Busco Inmueble.click" 
                  src="/assets/logo.png" 
                  className={`w-auto transition-all duration-300 ${
                    isScrolled ? 'h-12' : 'h-16'
                  }`} 
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="col-span-6 md:col-span-2 flex justify-end items-center md:hidden">
              <Button variant="ghost" title="Menu" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Menu */}
            <nav className="nav-principal hidden md:flex md:col-span-7 md:justify-around md:items-center">
              {/* Column 1 */}
              <div>
                <ul className="nav-site">
                  <li>
                    <Link href="/" className="nav-link text-[#212121] hover:text-[#FF5733]">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="nav-link text-[#212121] hover:text-[#FF5733]">
                      Calculadora
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <ul className="nav-site">
                  <li>
                    <Link href="/proyectos" className="nav-link text-[#212121] hover:text-[#FF5733]">
                      Emprendimientos
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://www.cmycbb.org.ar/" 
                      target="_blank" 
                      rel="noopener" 
                      className="nav-link text-[#212121] hover:text-[#FF5733]"
                    >
                      Colegio de Martilleros
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <ul className="nav-site">
                  <li>
                    <Link href="/properties" className="nav-link text-[#212121] hover:text-[#FF5733]">
                      Propiedades
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://www.colescba.org.ar/portal/delegaciones/delegacion-bahia-blanca" 
                      target="_blank" 
                      rel="noopener" 
                      className="nav-link text-[#212121] hover:text-[#FF5733]"
                    >
                      Colegio de Escribanos
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <ul className="nav-site">
                  <li>
                    <Link href="/inmobiliarias" className="nav-link text-[#212121] hover:text-[#FF5733]">
                      Inmobiliarias
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="nav-link text-[#212121] hover:text-[#FF5733]">
                      Contacto
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Auth Buttons */}
            <nav className="col-span-12 md:col-span-3 flex justify-center pt-3 md:pt-0 md:justify-end items-center button-actions">
              {isLoading ? (
                <div className="w-6 h-6 animate-spin border-2 border-[#FF5733] border-t-transparent rounded-full" />
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-1 bg-[#FF5733] hover:bg-[#ff6e52] text-white" data-testid="button-account">
                      <User className="h-4 w-4 mr-2" />
                      Mi cuenta
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/agency-dashboard" className="cursor-pointer flex items-center" data-testid="link-agency-dashboard">
                        <Building2 className="h-4 w-4 mr-2" />
                        Panel de Agencia
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin-dashboard" className="cursor-pointer flex items-center" data-testid="link-admin-dashboard">
                        <Settings className="h-4 w-4 mr-2" />
                        Panel de Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" className="cursor-pointer flex items-center" data-testid="button-logout">
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <a href="/api/login">
                    <Button className="bg-[#FF5733] hover:bg-[#ff6e52] text-white" data-testid="button-login">
                      Iniciar Sesión
                    </Button>
                  </a>
                  <Link href="/subscribe">
                    <Button className="ml-1 bg-[#FF5733] hover:bg-[#ff6e52] text-white" data-testid="button-subscribe">
                      Suscribirse
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </nav>
      </div>
    </header>
  );
}
