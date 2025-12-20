
import { Link } from "wouter";

export default function DashboardNav() {
    const links = [
        { label: "Suscripción al sistema", href: "/subscribe" },
        { label: "Tarifario Publicitario", href: "#" },
        { label: "Condiciones de publicación", href: "#" },
        { label: "Condiciones comerciales comunes", href: "#" },
        { label: "Términos y Condiciones", href: "/terms" },
        { label: "Tutorial", href: "#" },
    ];

    return (
        <div className="w-full border-y border-gray-200 bg-white py-3 mb-8">
            <nav className="max-w-7xl mx-auto px-4 overflow-x-auto">
                <ul className="flex items-center justify-between min-w-max gap-4 text-sm font-medium text-gray-600">
                    {links.map((link, index) => (
                        <li key={index} className="flex items-center">
                            <Link href={link.href} className="hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
                                {link.label}
                            </Link>
                            {index < links.length - 1 && (
                                <span className="ml-4 text-gray-300 select-none">|</span>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
