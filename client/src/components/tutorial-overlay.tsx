import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export default function TutorialOverlay() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Show tutorial after 2 seconds if user hasn't seen it
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleStartTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hasSeenTutorial", "true");
    // TODO: Implement step-by-step tutorial system with Intro.js or Driver.js
    alert("Tutorial iniciado - Implementación pendiente");
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hasSeenTutorial", "true");
  };

  return (
    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
      <DialogContent className="max-w-md" data-testid="tutorial-overlay">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            ¡Bienvenido al Portal!
          </h3>
          <p className="text-muted-foreground mb-6">
            ¿Te gustaría hacer un tour guiado para conocer todas las funcionalidades?
          </p>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCloseTutorial}
              data-testid="close-tutorial"
            >
              Tal vez después
            </Button>
            <Button 
              className="flex-1"
              onClick={handleStartTutorial}
              data-testid="start-tutorial"
            >
              Comenzar tour
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
