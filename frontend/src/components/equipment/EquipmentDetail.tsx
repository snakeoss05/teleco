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

// Define interface based on your backend object
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

// Fake fetch function - replace with real API call

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
    deleteEquipment(id , token)
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
                </div>
                <EquipmentIcon type={equipment.type} />
              </div>
            </div>
            <div></div>
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
          {equipment.location && (
            <SimpleMapPreview
              _id={equipment._id}
              lat={equipment.lat}
              name={equipment.name}
              lng={equipment.lng}
            />
          )}
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
