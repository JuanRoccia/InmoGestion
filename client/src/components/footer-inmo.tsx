import { Link } from "wouter";
import { Facebook, Youtube, Instagram } from "lucide-react";

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href}>
    <a className="block text-xs text-gray-600 hover:text-gray-900 transition-colors">
      {children}
    </a>
  </Link>
);

export default function FooterInmo() {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-[110px_1fr_110px] gap-8 items-start">
          {/* Logo Izquierdo */}
          <div className="flex items-start justify-start">
            <img 
              src="/assets/logo.png" 
              alt="Busco Inmueble" 
              className="w-[110px] h-auto"
            />
          </div>

          {/* Contenido Central */}
          {/* justify-items-center justify-center justify-content-center */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">
            {/* Navigation Links */}
            <FooterSection title="Navegación">
              <FooterLink href="/">Inicio</FooterLink>
              <FooterLink href="/properties">Propiedades</FooterLink>
              <FooterLink href="/agencies">Inmobiliarias</FooterLink>
              <FooterLink href="/contact">Contacto</FooterLink>
            </FooterSection>

            {/* Legal Links */}
            <FooterSection title="Legal">
              <FooterLink href="/privacy">Política de Privacidad</FooterLink>
              <FooterLink href="/terms">Términos y Condiciones</FooterLink>
              <FooterLink href="/cookies">Política de Cookies</FooterLink>
              <FooterLink href="/accessibility">Accesibilidad</FooterLink>
            </FooterSection>

            {/* Contact & Social */}
            <div className="space-y-4">
              <FooterSection title="Contacto">
                <p className="text-xs text-gray-600">
                  8000 Bahía Blanca<br />
                  Provincia de Buenos Aires<br />
                  291 4652552<br />
                  <a 
                    href="mailto:buscoinmuebles@buscoinmuebles.com.ar" 
                    className="hover:text-gray-900 transition-colors"
                  >
                    buscoinmuebles@buscoinmuebles.com.ar
                  </a>
                </p>
              </FooterSection>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-2">Seguinos en las redes</h3>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff2e06] hover:bg-[#e62905] text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff2e06] hover:bg-[#e62905] text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff2e06] hover:bg-[#e62905] text-white transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff2e06] hover:bg-[#e62905] text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Logo Derecho */}
          <div className="flex items-start justify-end">
            <img 
              src="/assets/logo.png" 
              alt="Busco Inmueble" 
              className="w-[110px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-xs text-gray-600 text-center">
            Buscoinmuebles.click es un producto de Hernández & asociados Agencia de Publicidad y Productora de Contenidos<br />
          </p>
          <p className="text-xs text-gray-600 text-center">
            © 2025 Buscoinmuebles.click - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}