// Función para generar un hash numérico de un string
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Photo IDs fijos de Unsplash de propiedades inmobiliarias de alta calidad
// Estas URLs NO consumen API calls, solo usan el CDN de Unsplash
const PROPERTY_PHOTO_IDS = [
  'photo-1560518883-ce09059eeffa', // Modern house
  'photo-1568605114967-8130f3a36994', // Luxury home
  'photo-1600596542815-ffad4c1539a9', // Modern interior
  'photo-1600607687939-ce8a6c25118c', // Beautiful apartment
  'photo-1600566753190-17f0baa2a6c3', // Contemporary house
  'photo-1600585154340-be6161a56a0c', // Elegant home
  'photo-1600566753086-00f18fb6b3ea', // Modern architecture
  'photo-1600047509807-ba8f99d2cdde', // Luxury property
  'photo-1600607687644-c7171b42498b', // Modern living room
  'photo-1600210492493-0946911123ea', // Beautiful house
  'photo-1600607687920-4e2a09cf159d', // Contemporary interior
  'photo-1600566752355-35792bedcfea', // Modern exterior
  'photo-1600585154526-990dced4db0d', // Luxury apartment
  'photo-1600566752229-250ed79c1f5f', // Beautiful interior
  'photo-1600573472592-401b489a3cdc', // Modern design
  'photo-1600047509358-9dc75507daeb', // Elegant apartment
  'photo-1600563438938-a9a27216b4f5', // Contemporary home
  'photo-1600210491369-e753d80a41f3', // Modern house exterior
  'photo-1600585154084-4e5fe7c39198', // Beautiful home interior
  'photo-1600566753151-384129cf4e3e', // Luxury living space
];

export const getPropertyImage = (propertyId: string, width: number = 800, quality: number = 80): string => {
  // Usar el ID de la propiedad para seleccionar una imagen fija y consistente
  const photoId = PROPERTY_PHOTO_IDS[Math.abs(hashCode(propertyId)) % PROPERTY_PHOTO_IDS.length];
  
  // Retornar URL del CDN de Unsplash (no consume API calls)
  return `https://images.unsplash.com/${photoId}?w=${width}&q=${quality}&fit=crop&auto=format`;
};