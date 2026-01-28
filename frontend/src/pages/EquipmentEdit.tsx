import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { fetchEquipmentById, updateEquipment } from "@/lib/api";
import type { EquipmentType } from "@/components/ui/equipment-icon";

interface Equipment {
  _id: string;
  name: string;
  type: EquipmentType;
  status: string;
  zone?: string;
  notes?: string;
  lat: number;
  lng: number;
}

export default function EquipmentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Equipment>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchEquipmentById(id)
      .then((eq) => setFormData(eq))
      .catch((err) => setError(err.message || "Failed to load equipment"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof Equipment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      await updateEquipment(id, formData);
      toast.success("Equipment updated successfully");
      navigate(`/equipment/${id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update equipment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          Loading...
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link to="/equipment">Back to Equipment List</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
          <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to={`/equipment/${id}`}>
                  <ArrowLeft size={20} />
                </Link>
              </Button>
              <h1 className="font-bold text-lg">Edit Equipment</h1>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FDT">FDT</SelectItem>
                  <SelectItem value="IPMSAN">IPMSAN</SelectItem>
                  <SelectItem value="SPLITTER">SPLITTER</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zone</label>
              <Input
                value={formData.zone || ""}
                onChange={(e) => handleChange("zone", e.target.value)}
              />
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={formData.lat ?? ""}
                  onChange={(e) => handleChange("lat", Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={formData.lng ?? ""}
                  onChange={(e) => handleChange("lng", Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                rows={4}
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="flex-1">
                <Save size={18} className="mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to={`/equipment/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AppLayout>
  );
}
