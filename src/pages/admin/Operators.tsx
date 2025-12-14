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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Operator } from "@/types/database";
import { Plus, Pencil, Trash2, Loader2, CheckCircle, Building2 } from "lucide-react";

export default function AdminOperators() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    city: "",
    description: "",
    verified: false,
    status: "active" as "active" | "inactive",
  });

  const { data: operators, isLoading } = useQuery({
    queryKey: ["operators-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operators")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Operator[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("operators").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators-admin"] });
      toast({ title: "Operator created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error creating operator", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("operators").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators-admin"] });
      toast({ title: "Operator updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: "Error updating operator", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("operators").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators-admin"] });
      toast({ title: "Operator deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting operator", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      city: "",
      description: "",
      verified: false,
      status: "active",
    });
    setEditingOperator(null);
  };

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      contact_person: operator.contact_person || "",
      phone: operator.phone,
      email: operator.email || "",
      city: operator.city,
      description: operator.description || "",
      verified: operator.verified,
      status: operator.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOperator) {
      updateMutation.mutate({ id: editingOperator.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Operators</h1>
            <p className="text-muted-foreground mt-1">Manage tour operators</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Operator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingOperator ? "Edit Operator" : "Add New Operator"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
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
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v as "active" | "inactive" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Verified</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={formData.verified}
                        onCheckedChange={(v) => setFormData({ ...formData, verified: v })}
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.verified ? "Verified" : "Not verified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingOperator ? "Update" : "Create"}
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
        ) : operators && operators.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operators.map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell className="font-medium">{operator.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{operator.contact_person}</div>
                        <div className="text-muted-foreground">{operator.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{operator.city}</TableCell>
                    <TableCell>
                      <Badge variant={operator.status === "active" ? "default" : "secondary"}>
                        {operator.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {operator.verified && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(operator)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(operator.id)}
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
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No operators yet. Add your first operator to get started.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}