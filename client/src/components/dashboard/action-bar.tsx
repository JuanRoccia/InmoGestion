
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User, Plus, ClipboardPlus, LayoutTemplate, Briefcase } from "lucide-react";

interface ActionProps {
    onAddProperty: () => void;
}

export default function ActionBar({ onAddProperty }: ActionProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-8 text-sm text-gray-600 border-b border-gray-200 pb-4">
            <Link href="/profile" className="flex items-center hover:text-primary transition-colors px-2 py-1">
                <User className="w-4 h-4 mr-1.5" />
                Perfil
            </Link>
            <span className="text-gray-300">|</span>

            <button
                onClick={onAddProperty}
                className="flex items-center hover:text-primary transition-colors px-2 py-1 cursor-pointer font-medium text-primary hover:underline"
            >
                <Plus className="w-4 h-4 mr-1.5" />
                Agregar Propiedad
            </button>
            <span className="text-gray-300">|</span>

            <button className="flex items-center hover:text-primary transition-colors px-2 py-1 cursor-not-allowed opacity-60" title="Próximamente">
                <ClipboardPlus className="w-4 h-4 mr-1.5" />
                Agregar Propiedades Solicitadas
            </button>
            <span className="text-gray-300">|</span>

            <button className="flex items-center hover:text-primary transition-colors px-2 py-1 cursor-not-allowed opacity-60" title="Próximamente">
                <LayoutTemplate className="w-4 h-4 mr-1.5" />
                Agregar Sección Destacados
            </button>
            <span className="text-gray-300">|</span>

            <a
                href="https://labrujula24.criservis.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors px-2 py-1"
            >
                <Briefcase className="w-4 h-4 mr-1.5" />
                Servicios Profesionales
            </a>
        </div>
    );
}
