import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Map,
  MessageSquare,
  LogOut,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/operators", label: "Operators", icon: Building2 },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-sidebar-primary" />
            <span className="font-display text-lg font-semibold text-sidebar-foreground">
              IND Group Tours
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50 mb-2 truncate">
            {user?.email}
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-foreground/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-sidebar flex flex-col">
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-sidebar-primary" />
                <span className="font-display text-lg font-semibold text-sidebar-foreground">
                  Admin
                </span>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-sidebar-foreground" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/70"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-display font-semibold">Admin Panel</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}