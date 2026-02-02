import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SimpleMapPreview } from "@/components/equipment/InlineMapPreview";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  EquipmentIcon,
  type EquipmentType,
} from "@/components/ui/equipment-icon";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Navigation,
  MoreVertical,
  MapPin,
  Calendar,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import { fetchEquipmentById, deleteEquipment } from "@/lib/api";

interface Equipment {
  _id: string;
  name: string;
  type: EquipmentType;
  status: string;
  zone?: string;
  notes?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchEquipmentById(id)
      .then((eq) => setEquipment(eq))
      .catch((err) => setError(err.message || "Failed to load equipment"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          Loading...
        </div>
      </AppLayout>
    );
  }

  if (error || !equipment) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <h1 className="text-2xl font-bold mb-2">Equipment Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || "The equipment doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/equipment">Back to Equipment List</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    if (!id) return;
    deleteEquipment(id, token)
      .then(() => {
        toast.success("Equipment deleted successfully");
        navigate("/equipment");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to delete equipment");
      });
  };

  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${equipment.lat},${equipment.lng}`;
    window.open(url, "_blank");
  };

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

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
          <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/equipment">
                  <ArrowLeft size={20} />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="font-bold text-lg">{equipment.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {equipment.zone || "No zone"}
                  </p>
                </div>
                <EquipmentIcon type={equipment.type} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={getStatusVariant(equipment.status)}>
                {equipment.status}
              </StatusBadge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/equipment/${id}/edit`}
                      className="flex items-center gap-2">
                      <Edit size={16} />
                      Edit Equipment
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={openNavigation}
                    className="flex items-center gap-2">
                    <Navigation size={16} />
                    Navigate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-6">
          {/* Map Preview */}
          {equipment.location && (
            <SimpleMapPreview
              _id={equipment._id}
              lat={equipment.lat}
              name={equipment.name}
              lng={equipment.lng}
            />
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={openNavigation} className="flex-1" size="lg">
              <Navigation size={18} className="mr-2" />
              Navigate to Location
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to={`/equipment/${id}/edit`}>
                <Edit size={18} className="mr-2" />
                Edit
              </Link>
            </Button>
          </div>

          {/* Equipment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 rounded-xl border p-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Info size={18} />
                General Information
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{equipment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{equipment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{equipment.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone</span>
                  <span className="font-medium">{equipment.zone || "—"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border p-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin size={18} />
                Location
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latitude</span>
                  <span className="font-medium">{equipment.lat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longitude</span>
                  <span className="font-medium">{equipment.lng}</span>
                </div>
                {equipment.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GeoJSON</span>
                    <span className="font-medium">
                      [{equipment.location.coordinates.join(", ")}]
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-xl border p-5 md:col-span-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar size={18} />
                Metadata
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">
                    {formatDate(equipment.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(equipment.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {equipment.notes && (
              <div className="space-y-4 rounded-xl border p-5 md:col-span-2">
                <h2 className="text-lg font-semibold">Notes</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {equipment.notes}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong>{equipment.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
