import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthOverlay from "@/components/auth-overlay";
import { useAuth } from "@/hooks/useAuth";
import { useCustomScrollbar } from "@/components/custom-scrollbar";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Properties from "@/pages/properties";
import PropertyDetail from "@/pages/property-detail";
import PropertyPreviewPage from "@/pages/property-preview-page";
import SolicitarInmueble from "@/pages/solicitar-inmueble";
import AdminDashboard from "@/pages/admin-dashboard";
import AgencyDashboard from "@/pages/agency-dashboard";
import Subscribe from "@/pages/subscribe";
import Agencies from "@/pages/agencies";
import Contact from "@/pages/contact";
import MapSearch from "@/pages/map-search";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Cookies from "@/pages/cookies";
import Accessibility from "@/pages/accessibility";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/solicitar-inmueble" component={SolicitarInmueble} />
      <Route path="/properties" component={Properties} />
      <Route path="/property/preview" component={PropertyPreviewPage} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/inmobiliarias" component={Agencies} />
      <Route path="/agencies" component={Agencies} />
      <Route path="/contacto" component={Contact} />
      <Route path="/contact" component={Contact} />
      {isAuthenticated && (
        <>
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/agency-dashboard" component={AgencyDashboard} />
        </>
      )}
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/mapa" component={MapSearch} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/accessibility" component={Accessibility} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useCustomScrollbar();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <AuthOverlay />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
