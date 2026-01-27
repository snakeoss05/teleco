import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Layers, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  EquipmentIcon,
  equipmentTypes,
  type EquipmentType,
} from "@/components/ui/equipment-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { LeafletMap } from "./LeafletMap";
import { Link } from "react-router-dom";
import { fetchEquipment } from "@/lib/api"; // <-- your API call function

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

export function MapView() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [activeTypeFilters, setActiveTypeFilters] = useState<EquipmentType[]>(
    [],
  );
  const [activeStatusFilters, setActiveStatusFilters] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      setLoading(true);
      try {
        const data: Equipment[] = await fetchEquipment();

        // Map location.coordinates to lat/lng if lat/lng are 0
        const mappedData = data.map((eq) => {
          const [lng, lat] = eq.location?.coordinates || [0, 0];
          return {
            ...eq,
            lat: eq.lat || lat,
            lng: eq.lng || lng,
          };
        });

        setEquipment(mappedData);
      } catch (err: any) {
        setError(err.message || "Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

  const toggleTypeFilter = (type: EquipmentType) => {
    setActiveTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleStatusFilter = (status: string) => {
    setActiveStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch =
        searchQuery === "" ||
        eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.zone?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        activeTypeFilters.length === 0 || activeTypeFilters.includes(eq.type);

      const matchesStatus =
        activeStatusFilters.length === 0 ||
        activeStatusFilters.includes(eq.status);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, activeTypeFilters, activeStatusFilters, equipment]);

  const clearAllFilters = () => {
    setActiveTypeFilters([]);
    setActiveStatusFilters([]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    activeTypeFilters.length > 0 ||
    activeStatusFilters.length > 0 ||
    searchQuery !== "";

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">Loading equipment...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  return (
    <div className="relative flex-1 h-full min-h-[calc(100vh-5rem)] md:min-h-screen">
      {/* Leaflet Map */}
      <div className="absolute inset-0">
        <LeafletMap
          equipment={filteredEquipment}
          selectedEquipment={selectedEquipment}
          onSelectEquipment={setSelectedEquipment}
          center={[36.83896060334566, 10.240616006893033]}
          zoom={15}
        />
      </div>

      {/* Search & Filters */}
      <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-[1000]">
        <div className="map-overlay p-2 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground ml-2 shrink-0" />
          <Input
            type="text"
            placeholder="Search equipment, zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="shrink-0 h-8 w-8">
              <X size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "shrink-0",
              (showFilters || hasActiveFilters) &&
                "bg-accent text-accent-foreground",
            )}>
            <Filter size={18} />
          </Button>
        </div>

        {hasActiveFilters && (
          <div className="mt-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium inline-flex items-center gap-2">
            {filteredEquipment.length} results
            <button
              onClick={clearAllFilters}
              className="hover:underline text-xs">
              Clear filters
            </button>
          </div>
        )}

        {showFilters && (
          <div className="map-overlay mt-2 p-4 animate-fade-in">
            {/* Type Filters */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Filter by Type</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 text-xs">
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {equipmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                    activeTypeFilters.includes(type)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-accent/50",
                  )}>
                  <EquipmentIcon type={type} size="sm" variant="ghost" />
                  <span className="text-xs font-medium capitalize">
                    {type.replace("-", " ")}
                  </span>
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold text-sm mb-3">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
                {["active", "warning", "inactive", "error"].map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className={cn(
                      "transition-all rounded-full",
                      activeStatusFilters.includes(status) &&
                        "ring-2 ring-accent ring-offset-2",
                    )}>
                    <StatusBadge status={status as any}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </StatusBadge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Selected Equipment Card */}
      {selectedEquipment && (
        <div className="absolute bottom-24 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-80 z-[1000] animate-slide-up">
          <EquipmentCard
            equipment={selectedEquipment}
            onClose={() => setSelectedEquipment(null)}
          />
        </div>
      )}

      {/* Floating Action Button - Desktop */}
      <Link to="/add" className="fab fab-primary hidden md:flex z-[1000]">
        <Plus size={24} />
      </Link>

      {/* Map Legend */}
      {showLegend && (
        <div className="absolute bottom-24 md:bottom-6 right-4 z-[1000] animate-fade-in">
          <div className="map-overlay p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground">
                LEGEND
              </h4>
              <button onClick={() => setShowLegend(false)}>
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1.5">
              {equipmentTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <EquipmentIcon type={type} size="sm" />
                  <span className="text-xs capitalize">
                    {type.replace("-", " ")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-xs">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-xs">Inactive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-xs">Error</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Counter Badge */}
      <div className="absolute top-4 right-20 md:right-4 md:top-auto md:bottom-20 z-[1000]">
        <div className="map-overlay px-3 py-1.5 text-sm font-medium">
          📍 {filteredEquipment.length} equipment
        </div>
      </div>
    </div>
  );
}
