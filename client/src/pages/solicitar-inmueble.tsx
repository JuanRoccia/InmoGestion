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
import { Send, Loader2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/ui/footer";

export default function SolicitarInmueble() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string }>({});
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    operationType: "",
    propertyType: "",
    location: "",
    budget: "",
    details: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const response = await fetch('/api/property-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ success: true, message: 'Solicitud enviada con éxito. Nos pondremos en contacto pronto.' });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          operationType: "",
          propertyType: "",
          location: "",
          budget: "",
          details: ""
        });
      } else {
        setSubmitStatus({ success: false, message: data.message || 'Error al enviar la solicitud' });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({ success: false, message: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mapping for Spanish field names to English
  const fieldNameMap: Record<string, string> = {
    'nombre': 'firstName',
    'apellido': 'lastName',
    'telefono': 'phone',
    'tipoOperacion': 'operationType',
    'tipoInmueble': 'propertyType',
    'ubicacion': 'location',
    'presupuesto': 'budget',
    'detalles': 'details'
  };

  const handleFieldChange = (spanishField: string, value: string) => {
    const englishField = fieldNameMap[spanishField] || spanishField;
    setFormData(prev => ({ ...prev, [englishField]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-[8.875rem] pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Título */}
          <div className="mb-8 justify-center text-center">
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
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange("nombre", e.target.value)}
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
                    value={formData.lastName}
                    onChange={(e) => handleFieldChange("apellido", e.target.value)}
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
                    onChange={(e) => handleFieldChange("email", e.target.value)}
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
                    value={formData.phone}
                    onChange={(e) => handleFieldChange("telefono", e.target.value)}
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
                    value={formData.operationType}
                    onValueChange={(value) => handleFieldChange("tipoOperacion", value)}
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
                    value={formData.propertyType}
                    onChange={(e) => handleFieldChange("tipoInmueble", e.target.value)}
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
                    value={formData.location}
                    onChange={(e) => handleFieldChange("ubicacion", e.target.value)}
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
                    value={formData.budget}
                    onChange={(e) => handleFieldChange("presupuesto", e.target.value)}
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
                    value={formData.details}
                    onChange={(e) => handleFieldChange("detalles", e.target.value)}
                  required
                  className="min-h-32 resize-none"
                />
              </div>
            </div>

            {/* Mensaje de estado */}
            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}

            {/* Botón de envío */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ff2e06] hover:bg-[#e62905] text-white h-12 px-8 font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar solicitud
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}