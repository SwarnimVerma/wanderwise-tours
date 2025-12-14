import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Map, Building2, MessageSquare, TrendingUp, Plus, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [toursRes, operatorsRes, enquiriesRes] = await Promise.all([
        supabase.from("tours").select("id, status", { count: "exact" }),
        supabase.from("operators").select("id, status", { count: "exact" }),
        supabase.from("enquiries").select("id, status", { count: "exact" }),
      ]);

      const tours = toursRes.data || [];
      const operators = operatorsRes.data || [];
      const enquiries = enquiriesRes.data || [];

      return {
        totalTours: tours.length,
        upcomingTours: tours.filter((t) => t.status === "upcoming").length,
        activeOperators: operators.filter((o) => o.status === "active").length,
        newEnquiries: enquiries.filter((e) => e.status === "new").length,
        totalEnquiries: enquiries.length,
      };
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to IND Group Tours Admin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tours
              </CardTitle>
              <Map className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalTours || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.upcomingTours || 0} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Operators
              </CardTitle>
              <Building2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.activeOperators || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Verified partners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Enquiries
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.newEnquiries || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.totalEnquiries || 0} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Tours
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.upcomingTours || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to book</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/operators">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Operator
              </Button>
            </Link>
            <Link to="/admin/tours">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Tour
              </Button>
            </Link>
            <Link to="/admin/enquiries">
              <Button variant="secondary">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Enquiries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}