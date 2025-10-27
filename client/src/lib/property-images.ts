const UNSPLASH_ACCESS_KEY = 'QmX5855Mjcn0o3MFSpEyzyrF3VP_FzilnDQUigKYKkQ';

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

// Colección de fotos curadas de propiedades inmobiliarias
const PROPERTY_COLLECTIONS = [
  '9389477',  // Modern Homes
  '3322116',  // Luxurious Houses
  '4933370',  // Real Estate
  '1262403',  // Architecture & Interiors
];

// Keywords para buscar imágenes
const PROPERTY_KEYWORDS = [
  "modern house",
  "luxury apartment",
  "real estate property",
  "modern architecture"
];

export const getPropertyImage = (propertyId: string, width: number = 800, quality: number = 80): string => {
  // Usar el ID de la propiedad para seleccionar una colección consistentemente
  const collectionId = PROPERTY_COLLECTIONS[Math.abs(hashCode(propertyId)) % PROPERTY_COLLECTIONS.length];
  
  // Usar source.unsplash.com para obtener una imagen aleatoria de la colección
  return `https://source.unsplash.com/collection/${collectionId}/${width}x${Math.floor(width * 0.75)}?${propertyId}`;
};

export const getRandomPropertyImage = async (propertyId: string, width: number = 800, quality: number = 80): Promise<string> => {
  try {
    const keyword = PROPERTY_KEYWORDS[Math.abs(hashCode(propertyId)) % PROPERTY_KEYWORDS.length];
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword)}&orientation=landscape&collections=${PROPERTY_COLLECTIONS.join(',')}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash API');
    }
    
    const data = await response.json();
    
    // Registrar la descarga como requiere Unsplash
    await fetch(`${data.links.download_location}?client_id=${UNSPLASH_ACCESS_KEY}`);
    
    // Retornar la URL optimizada
    return `${data.urls.raw}&w=${width}&q=${quality}&fit=crop&auto=format`;
  } catch (error) {
    console.error('Error fetching from Unsplash API:', error);
    // Fallback a la función sincrónica en caso de error
    return getPropertyImage(propertyId, width, quality);
  }
};