import { useEffect, useState } from "react";
import { Search, Filter, LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  EquipmentIcon,
  equipmentTypes,
  type EquipmentType,
  getEquipmentConfig,
} from "@/components/ui/equipment-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchEquipment } from "@/lib/api";

type Equipment = {
  location: any;
  _id: string;
  name: string;
  type: EquipmentType;
  status: string;
  lat: number;
  lng: number;
  ports: number;
  zone: string;
};

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await fetchEquipment();
        setEquipment(data);
      } catch (err: any) {
        setError(err.message || "Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, []);

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

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || eq.type === filterType;
    const matchesStatus = filterStatus === "all" || eq.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">Loading equipment...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Equipment</h1>
          <p className="text-muted-foreground text-sm">
            {filteredEquipment.length} items found
          </p>
        </div>
        <Button className="gap-2 w-full md:w-auto" asChild>
          <Link to="/add">
            <Plus size={18} />
            Add Equipment
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment, zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {equipmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getEquipmentConfig(type).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}>
              <LayoutGrid size={16} />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}>
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Equipment Grid/List */}
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1",
        )}>
        {filteredEquipment.map((equipment) => (
          <Link
            key={equipment._id}
            to={`/equipment/${equipment._id}`}
            className={cn(
              "bg-card border rounded-xl p-4 card-interactive",
              viewMode === "list" && "flex items-center gap-4",
            )}>
            <div
              className={cn(
                "flex items-center gap-3",
                viewMode === "grid" && "mb-3",
              )}>
              <EquipmentIcon
                type={equipment.type}
                size={viewMode === "list" ? "default" : "lg"}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{equipment.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {equipment.zone}
                </p>
              </div>
              {viewMode === "list" && (
                <StatusBadge status={getStatusVariant(equipment.status)}>
                  {equipment.status}
                </StatusBadge>
              )}
            </div>

            {viewMode === "grid" && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge status={getStatusVariant(equipment.status)}>
                    {equipment.status}
                  </StatusBadge>
                  <span className="text-sm text-muted-foreground">
                    {equipment.ports} ports
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {equipment.lat.toFixed(2)},{equipment.lng.toFixed(2)}
                </p>
              </>
            )}

            {viewMode === "list" && (
              <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                <span>{equipment.ports} ports</span>
                <span>
                  {equipment.lat.toFixed(2)},{equipment.lng.toFixed(2)}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No equipment found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
