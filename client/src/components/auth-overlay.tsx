import { useAuth } from "@/hooks/useAuth";

export default function AuthOverlay() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || isAuthenticated) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}