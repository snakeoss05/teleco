import { useEffect, useRef } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  EquipmentIcon,
  equipmentTypes,
  type EquipmentType,
} from "@/components/ui/equipment-icon";

interface Equipment {
  _id: string;
  name: string;
  type: EquipmentType;
  status: string;
  zone?: string;
  notes?: string;
  ports?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
}

interface LeafletMapProps {
  equipment: Equipment[];
  selectedEquipment: Equipment | null;
  onSelectEquipment: (eq: Equipment | null) => void;
  center: [number, number];
  zoom: number;
}

function getLeafletIcon(type: EquipmentType) {
  const iconHtml = renderToStaticMarkup(<EquipmentIcon type={type} />);

  return L.divIcon({
    html: iconHtml,
    className: "equipment-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export function LeafletMap({
  equipment,
  selectedEquipment,
  onSelectEquipment,
  center,
  zoom,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current!).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old cluster group
    if (markersRef.current) {
      markersRef.current.clearLayers();
      mapRef.current.removeLayer(markersRef.current);
    }

    const clusterGroup = (L as any).markerClusterGroup({
      maxClusterRadius: 80,
      disableClusteringAtZoom: 16,
    });

    equipment.forEach((eq) => {
      const icon = getLeafletIcon(eq.type);

      const marker = L.marker([eq.lat, eq.lng], { icon });

      marker.bindPopup(
        `<strong>${eq.name}</strong><br/>
         Type: ${eq.type}<br/>
         Status: ${eq.status}`,
      );

      marker.on("click", () => onSelectEquipment(eq));
      clusterGroup.addLayer(marker);
    });

    clusterGroup.addTo(mapRef.current);
    markersRef.current = clusterGroup;
  }, [equipment]);

  useEffect(() => {
    if (!selectedEquipment || !mapRef.current) return;
    mapRef.current.setView([selectedEquipment.lat, selectedEquipment.lng], 17, {
      animate: true,
    });
  }, [selectedEquipment]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
