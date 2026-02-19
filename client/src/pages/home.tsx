import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  BuscoInmueble<span className="text-primary">.click</span>
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,46,6,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(126,87,194,0.08),transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Próximamente
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Estamos trabajando en algo{" "}
              <span className="text-primary">increíble</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Una nueva experiencia para encontrar tu propiedad ideal en Bahía Blanca. 
              Mantente al tanto de nuestro lanzamiento.
            </p>

            {/* Newsletter Subscription */}
            <Card className="max-w-md mx-auto mb-12">
              <CardContent className="p-6">
                {subscribed ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground">¡Gracias por suscribirte!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Te avisaremos cuando lancemos.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-foreground">Recibe notificaciones</h3>
                      <p className="text-sm text-muted-foreground">
                        Sé el primero en saber cuando lancemos
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Launch Info Cards */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">1000+</h3>
                <p className="text-xs text-muted-foreground">Propiedades</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">50+</h3>
                <p className="text-xs text-muted-foreground">Barrios</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">100+</h3>
                <p className="text-xs text-muted-foreground">Inmobiliarias</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-foreground mb-10">
            Lo que viene
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Búsqueda Avanzada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Encuentra exactamente lo que buscas con filtros inteligentes por ubicación, precio y características.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Mapa Interactivo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explora propiedades en un mapa interactivo con información en tiempo real del mercado.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Para Inmobiliarias
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gestión completa de propiedades con planes adaptados a tu tamaño de negocio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-foreground mb-10">
            ¿Necesitas ayuda ahora?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:contacto@buscoinmueble.click" className="text-sm text-primary hover:underline">
                    contacto@buscoinmueble.click
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Teléfono</h3>
                  <a href="tel:+5492915123456" className="text-sm text-primary hover:underline">
                    +54 9 291 512-3456
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">
                BuscoInmueble<span className="text-primary">.click</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contacto
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 BuscoInmueble.click - Bahía Blanca
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
