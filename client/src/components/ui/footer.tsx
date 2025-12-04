import { Link } from "wouter";

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3 text-center">
    <h3 className="font-semibold text-gray-800">{title}</h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
    {children}
  </Link>
);

const SocialIcon = ({ href, icon }: { href: string; icon: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
  >
    <i className={`fab fa-${icon}`} />
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center align-center" style={{ textAlign: 'center' }}>
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

          {/* Contact Information */}
          <FooterSection title="Contacto">
            <p className="text-sm text-gray-600">
              Irigoyen 381 Piso 10<br />
              8000 Bahía Blanca<br />
              Provincia de Buenos Aires<br />
              +54 291<br />
              <a href="mailto:dh@hernandezyasociados.com.ar" className="hover:text-gray-900 transition-colors">
                dh@hernandezyasociados.com.ar
              </a>
            </p>
          </FooterSection>

          {/* Social Media */}
          <FooterSection title="Síguenos">
            <div className="flex space-x-3 justify-center">
              <SocialIcon href="https://facebook.com" icon="facebook-f" />
              <SocialIcon href="https://twitter.com" icon="twitter" />
              <SocialIcon href="https://instagram.com" icon="instagram" />
              <SocialIcon href="https://linkedin.com" icon="linkedin-in" />
            </div>
          </FooterSection>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © 2025 Buscoinmuebles.click - Todos los derechos reservados
            </p>
            <p className="text-sm text-gray-600 text-center md:text-left">
              Buscoinmuebles.click es un producto de Hernández & asociados <br className="md:hidden" />
              Agencia de Publicidad y Productora de Contenidos
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}