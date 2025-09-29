import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User, LogOut, Building2, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                InmoPortal
              </h1>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="nav-link text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Inicio
            </Link>
            <Link href="/properties" className="nav-link text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Propiedades
            </Link>
            <Link href="#" className="nav-link text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Emprendimientos
            </Link>
            <Link href="#" className="nav-link text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Inmobiliarias
            </Link>
            <Link href="#" className="nav-link text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Calculadora
            </Link>
            <Link href="#" className="nav-link text-foreground hover:text-primary px-3 py-2 text-sm font-medium">
              Contacto
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 animate-spin border-2 border-primary border-t-transparent rounded-full" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="user-menu">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">{user.firstName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center w-full" data-testid="dashboard-link">
                      <Building2 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center w-full" data-testid="admin-link">
                      <Settings className="mr-2 h-4 w-4" />
                      Administración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center w-full" data-testid="logout-link">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <a href="/api/login" data-testid="login-button">
                  <Button variant="ghost" className="hidden md:inline-flex">
                    Mi cuenta
                  </Button>
                </a>
                <Link href="/subscribe">
                  <Button data-testid="register-button">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <Button variant="ghost" className="md:hidden p-2" data-testid="mobile-menu">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
