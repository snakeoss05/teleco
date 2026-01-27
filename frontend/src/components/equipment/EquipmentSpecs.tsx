import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  MapPin,
  Cpu,
  Hash,
  Cable,
  Plug,
  Building,
  FileText,
  Wrench,
} from "lucide-react";
import { type EquipmentType } from "@/components/ui/equipment-icon";

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
    coordinates: [number, number]; // [lng, lat]
  };
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
  photos?: string[];
  maintenanceHistory?: Array<{
    id: string;
    date: string;
    type: string;
    technician: string;
    notes: string;
    status: string;
  }>;
}

interface EquipmentSpecsProps {
  equipment: Equipment;
}

export function EquipmentSpecs({ equipment }: EquipmentSpecsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Port Usage Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plug size={18} className="text-accent" />
            Port Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Used / Total</span>
              <span className="font-semibold">{equipment.ports} ports</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {equipment.ports} available
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin size={18} className="text-accent" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Building size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">{equipment.notes}</p>
              <p className="text-xs text-muted-foreground">{equipment.zone}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
            Coordinates: {equipment.lat?.toFixed(6)},{" "}
            {equipment.lng?.toFixed(6)}
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu size={18} className="text-accent" />
            Technical Specifications
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar size={18} className="text-accent" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Installed</span>
              <span className="text-sm font-medium">
                {formatDate(equipment.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Wrench size={14} />
                Last Maintenance
              </span>
              <span className="text-sm font-medium">
                {formatDate(equipment.updatedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {equipment.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {equipment.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
