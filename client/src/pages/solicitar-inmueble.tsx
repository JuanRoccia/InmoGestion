import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/ui/footer";

export default function SolicitarInmueble() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    tipoOperacion: "",
    tipoInmueble: "",
    ubicacion: "",
    presupuesto: "",
    detalles: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí iría la lógica de envío del formulario
    alert("Solicitud enviada con éxito. Nos pondremos en contacto pronto.");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-[5.875rem] pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Solicitar Inmueble</h1>
            <p className="text-gray-600">Completá el formulario y te ayudaremos a encontrar tu propiedad ideal</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            {/* Información Personal */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Información Personal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono/Celular <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="Teléfono o Celular"
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Información del Inmueble */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Información del Inmueble</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo de Operación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Operación <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.tipoOperacion}
                    onValueChange={(value) => handleChange("tipoOperacion", value)}
                    required
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleccione tipo de operación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="alquiler">Alquiler</SelectItem>
                      <SelectItem value="alquiler-temporal">Alquiler Temporal</SelectItem>
                      <SelectItem value="emprendimiento">Emprendimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Inmueble */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Inmueble <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Casa, Departamento, Terreno, etc."
                    value={formData.tipoInmueble}
                    onChange={(e) => handleChange("tipoInmueble", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Ubicación Deseada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación Deseada <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Barrio, Ciudad, etc."
                    value={formData.ubicacion}
                    onChange={(e) => handleChange("ubicacion", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* Presupuesto Aproximado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presupuesto Aproximado <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Presupuesto"
                    value={formData.presupuesto}
                    onChange={(e) => handleChange("presupuesto", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalles adicionales de su solicitud <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Describa los detalles específicos que busca en el inmueble"
                  value={formData.detalles}
                  onChange={(e) => handleChange("detalles", e.target.value)}
                  required
                  className="min-h-32 resize-none"
                />
              </div>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#ff2e06] hover:bg-[#e62905] text-white h-12 px-8 font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar solicitud
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}