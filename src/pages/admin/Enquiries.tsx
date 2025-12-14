import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
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
import { Enquiry } from "@/types/database";
import { Loader2, MessageSquare, Phone } from "lucide-react";
import { format } from "date-fns";

export default function AdminEnquiries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ["enquiries-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*, tour:tours(id, title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Enquiry & { tour: { id: string; title: string } | null })[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("enquiries")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries-admin"] });
      toast({ title: "Status updated" });
    },
    onError: (error) => {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive";
      case "contacted": return "default";
      case "closed": return "secondary";
      default: return "outline";
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Hi ${name}, thank you for your enquiry about our tour. How can I help you?`);
    window.open(`https://wa.me/91${cleanPhone}?text=${message}`, "_blank");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Enquiries</h1>
          <p className="text-muted-foreground mt-1">Manage customer enquiries</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : enquiries && enquiries.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{enquiry.name}</div>
                        <div className="text-sm text-muted-foreground">{enquiry.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{enquiry.tour?.title || "Unknown Tour"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {enquiry.message || "No message"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {format(new Date(enquiry.created_at), "dd MMM yyyy HH:mm")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={enquiry.status}
                        onValueChange={(status) =>
                          updateStatusMutation.mutate({ id: enquiry.id, status })
                        }
                      >
                        <SelectTrigger className="w-28">
                          <Badge variant={getStatusColor(enquiry.status)} className="capitalize">
                            {enquiry.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(enquiry.phone, enquiry.name)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          WhatsApp
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
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No enquiries yet. Enquiries will appear here when customers submit them.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}