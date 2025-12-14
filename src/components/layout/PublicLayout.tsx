import { ReactNode } from "react";
import { PublicNavbar } from "./PublicNavbar";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main>{children}</main>
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IND Group Tours. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Group bus tours departing from Raipur, Durg, Bhilai & nearby cities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}