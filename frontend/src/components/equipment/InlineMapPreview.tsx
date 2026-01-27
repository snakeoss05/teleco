import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { type EquipmentType } from "@/components/ui/equipment-icon";

interface MapPreviewProps {
  _id: string;
  name: string;

  lat?: number;
  lng?: number;
}

const getCoordinates = (
  props: MapPreviewProps,
): { lat: number; lng: number } | null => {
  if (props.lat !== undefined && props.lng !== undefined) {
    return { lat: props.lat, lng: props.lng };
  }

  return null;
};

export function SimpleMapPreview(props: MapPreviewProps) {
  const coords = getCoordinates(props);
  const { name } = props;

  if (!coords) {
    return (
      <Card className="p-4">
        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500 text-sm">No location data</p>
        </div>
      </Card>
    );
  }

  const { lat, lng } = coords;

  // Generate OpenStreetMap URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        {/* Embedded OSM iframe */}
        <iframe
          className="w-full h-full border-0"
          src={mapUrl}
          title={`Map of ${name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Overlay content */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-sm">
          {name}
        </div>

        <Button size="sm" className="absolute bottom-2 right-2" asChild>
          <a href={osmLink} target="_blank" rel="noopener noreferrer">
            <Maximize2 size={14} className="mr-1" />
            Open Map
          </a>
        </Button>
      </div>
    </Card>
  );
}
