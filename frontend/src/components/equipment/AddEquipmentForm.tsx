import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
  Crosshair,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  EquipmentIcon,
  equipmentTypes,
  type EquipmentType,
  getEquipmentConfig,
} from "@/components/ui/equipment-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createEquipment } from "@/lib/api";
import { SimpleMapPreview } from "./InlineMapPreview";

const steps = [
  { id: 1, title: "Type", description: "Select equipment type" },
  { id: 2, title: "Location", description: "Set GPS coordinates" },
  { id: 3, title: "Details", description: "Add specifications" },
  { id: 4, title: "Review", description: "Confirm and save" },
];

export function AddEquipmentForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "" as EquipmentType | "",
    name: "",
    lat: "",
    lng: "",
    ports: "",
    status: "active",
    zone: "",
    notes: "",
  });
  const token = localStorage.getItem("token");
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField("lat", position.coords.latitude.toFixed(6));
          updateField("lng", position.coords.longitude.toFixed(6));
          toast({
            title: "Location captured",
            description: "GPS coordinates have been filled automatically.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get your current location.",
            variant: "destructive",
          });
        },
      );
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      if (!token) {
        toast({
          title: "Not authenticated",
          description: "Please log in to add equipment.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        name: formData.name,
        type: formData.type,
        lat: formData.lat,
        lng: formData.lng,
        ports: formData.ports,
        status: formData.status,
        zone: formData.zone,
        notes: formData.notes,
      };

      await createEquipment(payload, token);

      toast({
        title: "Equipment added!",
        description: `${formData.name} has been added successfully.`,
      });

      navigate("/equipment");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.lat && !!formData.lng;
      case 3:
        return !!formData.name && !!formData.ports;
      default:
        return true;
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Add Equipment</h1>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 4
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  currentStep === step.id &&
                    "bg-accent text-accent-foreground ring-4 ring-accent/20",
                  currentStep > step.id && "bg-success text-success-foreground",
                  currentStep < step.id && "bg-muted text-muted-foreground",
                )}>
                {currentStep > step.id ? <Check size={18} /> : step.id}
              </div>
              <span className="text-xs mt-2 hidden md:block text-muted-foreground">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 md:w-16 mx-2",
                  currentStep > step.id ? "bg-success" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Step 1: Type Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              Select Equipment Type
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {equipmentTypes.map((type) => {
                const config = getEquipmentConfig(type);
                return (
                  <button
                    key={type}
                    onClick={() => updateField("type", type)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      formData.type === type
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50",
                    )}>
                    <EquipmentIcon type={type} size="lg" />
                    <span className="text-sm font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Set Location</h2>

            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="w-full gap-2 h-12">
              <Crosshair size={18} />
              Use Current GPS Location
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter manually
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="40.7128"
                  value={formData.lat}
                  onChange={(e) => updateField("lat", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="-74.0060"
                  value={formData.lng}
                  onChange={(e) => updateField("lng", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zone">Zone / Area</Label>
              <Input
                id="zone"
                placeholder="North District"
                value={formData.zone}
                onChange={(e) => updateField("zone", e.target.value)}
              />
            </div>

            {formData.lat ? (
              <SimpleMapPreview
                _id="preview"
                lat={parseFloat(formData.lat)}
                name={formData.name}
                lng={parseFloat(formData.lng)}
              />
            ) : (
              <div className="h-40 rounded-xl bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Map preview</p>

                  <MapPin size={32} className="mx-auto mb-2" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Equipment Details</h2>

            <div>
              <Label htmlFor="name">Equipment Name / ID</Label>
              <Input
                id="name"
                placeholder="FDT-001"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ports">Number of Ports</Label>
                <Input
                  id="ports"
                  type="number"
                  placeholder="24"
                  value={formData.ports}
                  onChange={(e) => updateField("ports", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Review & Confirm</h2>

            <div className="bg-card border rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-4">
                {formData.type && (
                  <EquipmentIcon type={formData.type} size="xl" />
                )}
                <div>
                  <h3 className="text-xl font-bold">{formData.name}</h3>
                  <p className="text-muted-foreground">
                    {formData.type && getEquipmentConfig(formData.type).label}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {formData.lat}, {formData.lng}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Zone</p>
                  <p className="font-medium">
                    {formData.zone || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ports</p>
                  <p className="font-medium">{formData.ports}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{formData.status}</p>
                </div>
              </div>

              {formData.notes && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6 border-t mt-6">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
        <Button
          onClick={currentStep === 4 ? handleSubmit : handleNext}
          disabled={!canProceed()}
          className="flex-1 gap-2">
          {currentStep === 4 ? (
            <>
              <Check size={16} />
              Save Equipment
            </>
          ) : (
            <>
              Next
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
