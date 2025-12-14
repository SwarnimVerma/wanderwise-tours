import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tour, Operator } from "@/types/database";
import { Plus, Pencil, Trash2, Loader2, Map, IndianRupee } from "lucide-react";
import { format } from "date-fns";

const tourTypes = ["Pilgrimage", "Adventure", "Heritage", "Beach", "Hill Station", "Wildlife"];
const departureCities = ["Raipur", "Durg", "Bhilai", "Bilaspur", "Korba"];

export default function AdminTours() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    operator_id: "",
    title: "",
    description: "",
    departure_city: "",
    destination: "",
    tour_type: "",
    start_date: "",
    end_date: "",
    duration_days: 1,
    price_per_person: 0,
    seats_total: 40,
    seats_available: 40,
    status: "draft" as "draft" | "upcoming" | "ongoing" | "completed",
  });

  const { data: tours, isLoading } = useQuery({
    queryKey: ["tours-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*, operator:operators(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tour[];
    },
  });

  const { data: operators } = useQuery({
    queryKey: ["operators-select"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operators")
        .select("id, name")
        .eq("status", "active")
        .order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("tours").insert({
        ...data,
        operator_id: data.operator_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours-admin"] });
      toast({ title: "Tour created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error creating tour", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("tours").update({
        ...data,
        operator_id: data.operator_id || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours-admin"] });
      toast({ title: "Tour updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error updating tour", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tours").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours-admin"] });
      toast({ title: "Tour deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting tour", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      operator_id: "",
      title: "",
      description: "",
      departure_city: "",
      destination: "",
      tour_type: "",
      start_date: "",
      end_date: "",
      duration_days: 1,
      price_per_person: 0,
      seats_total: 40,
      seats_available: 40,
      status: "draft",
    });
    setEditingTour(null);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setFormData({
      operator_id: tour.operator_id || "",
      title: tour.title,
      description: tour.description || "",
      departure_city: tour.departure_city,
      destination: tour.destination,
      tour_type: tour.tour_type,
      start_date: tour.start_date,
      end_date: tour.end_date,
      duration_days: tour.duration_days,
      price_per_person: tour.price_per_person,
      seats_total: tour.seats_total,
      seats_available: tour.seats_available,
      status: tour.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTour) {
      updateMutation.mutate({ id: editingTour.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "default";
      case "ongoing": return "secondary";
      case "completed": return "outline";
      default: return "outline";
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Tours</h1>
            <p className="text-muted-foreground mt-1">Manage tour packages</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingTour ? "Edit Tour" : "Create New Tour"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., South India Temple Tour"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Operator</Label>
                  <Select
                    value={formData.operator_id}
                    onValueChange={(v) => setFormData({ ...formData, operator_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators?.map((op) => (
                        <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departure City *</Label>
                    <Select
                      value={formData.departure_city}
                      onValueChange={(v) => setFormData({ ...formData, departure_city: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {departureCities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g., South India"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tour Type *</Label>
                    <Select
                      value={formData.tour_type}
                      onValueChange={(v) => setFormData({ ...formData, tour_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tourTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v as typeof formData.status })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration_days">Duration (Days) *</Label>
                    <Input
                      id="duration_days"
                      type="number"
                      min="1"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Person (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price_per_person}
                      onChange={(e) => setFormData({ ...formData, price_per_person: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats_total">Total Seats *</Label>
                    <Input
                      id="seats_total"
                      type="number"
                      min="1"
                      value={formData.seats_total}
                      onChange={(e) => setFormData({ ...formData, seats_total: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats_available">Available Seats *</Label>
                    <Input
                      id="seats_available"
                      type="number"
                      min="0"
                      value={formData.seats_available}
                      onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingTour ? "Update Tour" : "Create Tour"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tours && tours.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tour.title}</div>
                        <div className="text-sm text-muted-foreground">{tour.operator?.name || "No operator"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {tour.departure_city} → {tour.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(tour.start_date), "dd MMM")} - {format(new Date(tour.end_date), "dd MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <IndianRupee className="h-3 w-3" />
                        {tour.price_per_person.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>{tour.seats_available}/{tour.seats_total}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(tour.status)} className="capitalize">
                        {tour.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(tour)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(tour.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tours yet. Create your first tour to get started.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}