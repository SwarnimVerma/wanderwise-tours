import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TourFiltersProps {
  filters: {
    search: string;
    departureCity: string;
    destination: string;
    tourType: string;
    month: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const departureCities = ["All", "Raipur", "Durg", "Bhilai", "Bilaspur", "Korba"];
const destinations = ["All", "South India", "Char Dham", "Kashmir", "Rajasthan", "Kerala", "North East", "Gujarat"];
const tourTypes = ["All", "Pilgrimage", "Adventure", "Heritage", "Beach", "Hill Station", "Wildlife"];
const months = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function TourFilters({ filters, onFilterChange }: TourFiltersProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Filter Tours</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tours..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Departure City</Label>
          <Select value={filters.departureCity} onValueChange={(v) => onFilterChange("departureCity", v)}>
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
          <Label>Destination</Label>
          <Select value={filters.destination} onValueChange={(v) => onFilterChange("destination", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest} value={dest}>{dest}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tour Type</Label>
          <Select value={filters.tourType} onValueChange={(v) => onFilterChange("tourType", v)}>
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
          <Label>Month</Label>
          <Select value={filters.month} onValueChange={(v) => onFilterChange("month", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}