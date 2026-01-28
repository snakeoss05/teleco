import { X, MapPin, Navigation, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  EquipmentIcon,
  type EquipmentType,
  getEquipmentConfig,
} from "@/components/ui/equipment-icon";
import { Link } from "react-router-dom";

interface Equipment {
  _id: string; // your DB ID
  name: string;
  type: EquipmentType;
  status: string;
  zone?: string;
  notes?: string;
  ports?: number;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  lat: number; // will be computed from location if 0
  lng: number; // will be computed from location if 0
  createdAt?: string;
  updatedAt?: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onClose?: () => void;
  compact?: boolean;
}

export function EquipmentCard({
  equipment,
  onClose,
  compact = false,
}: EquipmentCardProps) {
  const config = getEquipmentConfig(equipment.type);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "active";
      case "warning":
        return "warning";
      case "inactive":
        return "inactive";
      case "error":
        return "error";
      default:
        return "info";
    }
  };
  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${equipment.lat},${equipment.lng}`;
    window.open(url, "_blank");
  };
  return (
    <div className="map-overlay p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <EquipmentIcon type={equipment.type} size="lg" />
          <div>
            <h3 className="font-semibold text-foreground">{equipment.name}</h3>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 -mr-2 -mt-2">
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Status & Info */}
      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={getStatusVariant(equipment.status)}>
          {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
        </StatusBadge>
        {equipment.ports && (
          <span className="text-xs text-muted-foreground">
            {equipment.ports} ports
          </span>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <MapPin size={14} />
        <span>
          {equipment.lat.toFixed(4)}, {equipment.lng.toFixed(4)}
        </span>
      </div>

      {/* Actions */}
      {!compact && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={openNavigation}>
            <Navigation size={14} />
            Navigate
          </Button>
          <Link to={`/equipment/${equipment._id}/edit`}>
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Edit size={14} />
              Edit
            </Button>{" "}
          </Link>
          <Button size="sm" variant="default" asChild className="gap-2">
            <Link key={equipment._id} to={`/equipment/${equipment._id}`}>
              <ExternalLink size={14} />
              Details
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
