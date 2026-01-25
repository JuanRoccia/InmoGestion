import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Fix for default marker icon in Leaflet + React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom hook to fit bounds
function SetBounds({ properties }: { properties: any[] }) {
    const map = useMap();

    useEffect(() => {
        if (properties.length > 0) {
            const bounds = L.latLngBounds(
                properties.map((p) => [parseFloat(p.latitude), parseFloat(p.longitude)])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [properties, map]);

    return null;
}

// New component to control map view
function MapController({ focusedLocation }: { focusedLocation: { lat: number; lng: number; zoom?: number } | null }) {
    const map = useMap();

    useEffect(() => {
        if (focusedLocation && !isNaN(focusedLocation.lat) && !isNaN(focusedLocation.lng)) {
            map.flyTo(
                [focusedLocation.lat, focusedLocation.lng],
                focusedLocation.zoom || 13,
                { duration: 1.5 }
            );
        }
    }, [focusedLocation, map]);

    return null;
}

interface PropertiesMapProps {
    properties: any[];
    focusedLocation?: { lat: number; lng: number; zoom?: number } | null;
}

export default function PropertiesMap({ properties, focusedLocation }: PropertiesMapProps) {
    // Default center (Buenos Aires, mostly arbitrary until bounds set)
    const defaultCenter: [number, number] = [-34.6037, -58.3816];

    // Filter only valid coords
    const validProperties = Array.isArray(properties) ? properties.filter(
        (p) => p.latitude && p.longitude
    ) : [];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* If focusedLocation is provided, use MapController, otherwise default to fitting bounds of properties */}
            {focusedLocation ? (
                <MapController focusedLocation={focusedLocation} />
            ) : (
                validProperties.length > 0 && <SetBounds properties={validProperties} />
            )}

            {validProperties.map((property) => (
                <Marker
                    key={property.id}
                    position={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                >
                    <Popup>
                        <div className="w-[200px]">
                            <div className="relative aspect-video mb-2 bg-gray-100 rounded overflow-hidden">
                                {property.images?.[0] ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                        Sin imagen
                                    </div>
                                )}
                                <Badge className="absolute top-1 right-1 px-1 py-0 text-[10px] bg-white/90 text-black hover:bg-white">
                                    {property.operationType}
                                </Badge>
                            </div>
                            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
                                {property.title}
                            </h3>
                            <p className="text-[#ff2e06] font-bold text-base mb-2">
                                {property.currency} {parseFloat(property.price).toLocaleString()}
                            </p>
                            <Link href={`/properties/${property.id}`}>
                                <Button size="sm" className="w-full text-xs h-7 bg-[#ff2e06] hover:bg-[#e62905] text-white">
                                    Ver detalle
                                </Button>
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
