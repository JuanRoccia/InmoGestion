import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "wouter";

const plans = [
  {
    id: "basic",
    name: "Plan Básico",
    price: 29,
    features: [
      "Hasta 10 propiedades",
      "Panel de control básico",
      "Soporte por email",
    ],
  },
  {
    id: "professional",
    name: "Plan Profesional",
    price: 79,
    popular: true,
    features: [
      "Hasta 50 propiedades",
      "Panel avanzado + Analytics",
      "Propiedades destacadas",
      "Soporte prioritario",
    ],
  },
  {
    id: "enterprise",
    name: "Plan Empresa",
    price: 149,
    features: [
      "Propiedades ilimitadas",
      "API personalizada",
      "White-label disponible",
      "Soporte 24/7",
    ],
  },
];

export default function SubscriptionPlans() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Planes de Suscripción
          </h3>
          <p className="text-lg text-muted-foreground">
            Elige el plan perfecto para tu inmobiliaria
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative hover:shadow-lg transition-shadow ${
                plan.popular ? "border-2 border-primary" : ""
              }`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h4>
                  <div className="text-3xl font-bold text-primary mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">por mes</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/subscribe">
                  <Button
                    className={`w-full font-semibold ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : plan.id === "enterprise"
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        : "bg-border text-foreground hover:bg-accent"
                    }`}
                    data-testid={`select-plan-${plan.id}`}
                  >
                    Seleccionar Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
