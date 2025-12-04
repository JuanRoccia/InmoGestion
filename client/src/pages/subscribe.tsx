import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import useAuthModalStore from "@/stores/auth-modal-store";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

const SubscribeForm = ({ selectedPlan }: { selectedPlan: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/agency-dashboard?payment_success=true`,
      },
    });

    if (error) {
      toast({
        title: "Error en el pago",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Bienvenido a InmoPortal. Redirigiendo al dashboard...",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-semibold text-foreground mb-2">Plan seleccionado: {selectedPlan.name}</h3>
        <p className="text-2xl font-bold text-primary">${selectedPlan.price}/mes</p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        data-testid="submit-payment"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isProcessing ? "Procesando..." : `Suscribirse por $${selectedPlan.price}/mes`}
      </Button>
    </form>
  );
};

const CheckoutWrapper = ({ selectedPlan }: { selectedPlan: any }) => {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Create subscription as soon as the checkout loads
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Error al crear la suscripción",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <SubscribeForm selectedPlan={selectedPlan} />
    </Elements>
  );
};

export default function Subscribe() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to professional
  const [showCheckout, setShowCheckout] = useState(false);

  const { setIsOpen } = useAuthModalStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsOpen(true);
    }
  }, [isAuthenticated, isLoading, setIsOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Iniciar sesión requerido</h1>
            <p className="text-muted-foreground">Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Planes de Suscripción
            </h1>
            <p className="text-lg text-muted-foreground">
              Elige el plan perfecto para tu inmobiliaria
            </p>
          </div>

          {!showCheckout ? (
            <>
              {/* Plans Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative hover:shadow-lg transition-all cursor-pointer ${selectedPlan.id === plan.id ? "ring-2 ring-primary" : ""
                      } ${plan.popular ? "border-2 border-primary" : ""}`}
                    onClick={() => setSelectedPlan(plan)}
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

                      <div className="text-center">
                        {selectedPlan.id === plan.id && (
                          <Badge variant="outline" className="border-primary text-primary">
                            Seleccionado
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                  data-testid="continue-to-payment"
                >
                  Continuar al pago
                </Button>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Finalizar Suscripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckoutWrapper selectedPlan={selectedPlan} />

                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowCheckout(false)}
                      data-testid="back-to-plans"
                    >
                      Volver a planes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
