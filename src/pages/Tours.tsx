import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { TourCard } from "@/components/tours/TourCard";
import { TourFilters } from "@/components/tours/TourFilters";
import { useTours } from "@/hooks/useTours";
import { Loader2 } from "lucide-react";

export default function Tours() {
  const [searchParams] = useSearchParams();
  const { data: tours, isLoading } = useTours();

  const [filters, setFilters] = useState({
    search: "",
    departureCity: searchParams.get("departure") || "All",
    destination: searchParams.get("destination") || "All",
    tourType: "All",
    month: "All",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredTours = useMemo(() => {
    if (!tours) return [];

    return tours.filter((tour) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !tour.title.toLowerCase().includes(searchLower) &&
          !tour.destination.toLowerCase().includes(searchLower) &&
          !tour.departure_city.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Departure city filter
      if (filters.departureCity !== "All" && tour.departure_city !== filters.departureCity) {
        return false;
      }

      // Destination filter
      if (filters.destination !== "All" && !tour.destination.includes(filters.destination)) {
        return false;
      }

      // Tour type filter
      if (filters.tourType !== "All" && tour.tour_type !== filters.tourType) {
        return false;
      }

      // Month filter
      if (filters.month !== "All") {
        const tourMonth = new Date(tour.start_date).toLocaleString("default", { month: "long" });
        if (tourMonth !== filters.month) {
          return false;
        }
      }

      return true;
    });
  }, [tours, filters]);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Explore Tours
          </h1>
          <p className="text-muted-foreground">
            Find your perfect group tour from our curated collection
          </p>
        </div>

        <TourFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTours.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {filteredTours.length} tour{filteredTours.length !== 1 ? "s" : ""}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tours found matching your criteria.</p>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}