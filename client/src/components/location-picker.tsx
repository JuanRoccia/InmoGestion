import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    cityLocation?: { lat: number, lng: number } | null;
}

function LocationMarker({ position, onLocationSelect }: { position: [number, number] | null, onLocationSelect: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

export default function LocationPicker({ latitude, longitude, onLocationSelect, cityLocation }: LocationPickerProps) {
    // Default to Buenos Aires if nothing known
    const defaultCenter: [number, number] = [-34.6037, -58.3816];

    // Determine center: 
    // 1. Existing point (lat/lng)
    // 2. Selected city location (cityLocation)
    // 3. Default center
    const center: [number, number] =
        (latitude && longitude) ? [latitude, longitude] :
            (cityLocation) ? [cityLocation.lat, cityLocation.lng] :
                defaultCenter;

    const markerPosition: [number, number] | null = (latitude && longitude) ? [latitude, longitude] : null;

    return (
        <div className="h-[300px] w-full rounded-md border overflow-hidden relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={markerPosition} onLocationSelect={onLocationSelect} />
                <MapController center={center} />
            </MapContainer>
            <div className="absolute bottom-2 left-2 bg-white/80 p-1 text-xs rounded z-[1000] pointer-events-none">
                Click en el mapa para marcar la ubicación exacta
            </div>
        </div>
    );
}
