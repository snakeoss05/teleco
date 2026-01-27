import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  History,
  Wrench,
  Search,
  ArrowUpCircle,
  PlusCircle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";

interface MaintenanceRecord {
  _id: string;
  date: string;
  type: string;
  technician: string;
  notes: string;
  status: "completed" | "pending" | "scheduled";
}

interface MaintenanceHistoryProps {
  history: MaintenanceRecord[];
}

const typeIcons: Record<string, React.ReactNode> = {
  Inspection: <Search size={16} />,
  Repair: <Wrench size={16} />,
  Upgrade: <ArrowUpCircle size={16} />,
  Installation: <PlusCircle size={16} />,
};

const statusConfig: Record<
  string,
  {
    icon: React.ReactNode;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  completed: { icon: <CheckCircle size={12} />, variant: "outline" },
  pending: { icon: <Clock size={12} />, variant: "secondary" },
  scheduled: { icon: <Clock size={12} />, variant: "default" },
};

export function MaintenanceHistory({ history }: MaintenanceHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History size={18} className="text-accent" />
            Maintenance History
          </CardTitle>
          <Button variant="outline" size="sm">
            <PlusCircle size={14} className="mr-1.5" />
            Add Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((record, index) => (
            <div key={record.id} className="relative pl-6 pb-4 last:pb-0">
              {/* Timeline line */}
              {index < history.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
                <span className="text-accent">
                  {typeIcons[record.type] || <Wrench size={12} />}
                </span>
              </div>

              {/* Content */}
              <div className="bg-muted/30 rounded-lg p-3 ml-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {record.type}
                      </span>
                      <Badge
                        variant={statusConfig[record.status].variant}
                        className="text-[10px] h-5">
                        {statusConfig[record.status].icon}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(record.date)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 mb-2">
                  {record.notes}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User size={12} />
                  <span>{record.technician}</span>
                </div>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No maintenance records yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
