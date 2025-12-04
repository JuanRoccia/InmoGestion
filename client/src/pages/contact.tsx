import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/header";
import Footer from "@/components/footer-inmo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";

const contactFormSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
    message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "¡Mensaje enviado!",
            description: "Nos pondremos en contacto contigo pronto.",
        });

        reset();
        setIsSubmitting(false);
    };

    return (
        /* header background (optional pt-28 || pt-[5.875rem]) */
        <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contacto</h1>
                        <p className="text-gray-600">
                            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Información de Contacto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-[#ff2e06] mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">Dirección</p>
                                            <p className="text-sm text-gray-600">
                                                Irigoyen 381 Piso 10<br />
                                                8000 Bahía Blanca<br />
                                                Provincia de Buenos Aires
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-[#ff2e06] mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">Teléfono</p>
                                            <p className="text-sm text-gray-600">+54 291</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-[#ff2e06] mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">Email</p>
                                            <a
                                                href="mailto:dh@hernandezyasociados.com.ar"
                                                className="text-sm text-gray-600 hover:text-[#ff2e06] transition-colors"
                                            >
                                                dh@hernandezyasociados.com.ar
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Placeholder */}
                            <Card>
                                <CardContent className="p-0">
                                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.4789!2d-62.2708!3d-38.7183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQzJzA2LjAiUyA2MsKwMTYnMTUuMCJX!5e0!3m2!1ses!2sar!4v1234567890"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Ubicación de Buscoinmuebles.click"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Envíanos un Mensaje</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nombre *
                                                </label>
                                                <Input
                                                    id="name"
                                                    {...register("name")}
                                                    placeholder="Tu nombre completo"
                                                    className={errors.name ? "border-red-500" : ""}
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email *
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    {...register("email")}
                                                    placeholder="tu@email.com"
                                                    className={errors.email ? "border-red-500" : ""}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Asunto *
                                            </label>
                                            <Input
                                                id="subject"
                                                {...register("subject")}
                                                placeholder="¿En qué podemos ayudarte?"
                                                className={errors.subject ? "border-red-500" : ""}
                                            />
                                            {errors.subject && (
                                                <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                Mensaje *
                                            </label>
                                            <Textarea
                                                id="message"
                                                {...register("message")}
                                                placeholder="Escribe tu mensaje aquí..."
                                                rows={6}
                                                className={errors.message ? "border-red-500" : ""}
                                            />
                                            {errors.message && (
                                                <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#ff2e06] hover:bg-[#e62905]"
                                        >
                                            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
