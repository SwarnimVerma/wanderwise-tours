import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { TourCard } from "@/components/tours/TourCard";
import { useFeaturedTours } from "@/hooks/useTours";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, MapPin, Shield, Users, IndianRupee, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const departureCities = ["Raipur", "Durg", "Bhilai", "Bilaspur", "Korba"];
const destinations = ["South India", "Char Dham", "Kashmir", "Rajasthan", "Kerala", "North East", "Gujarat"];

const Index = () => {
  const navigate = useNavigate();
  const { data: featuredTours, isLoading } = useFeaturedTours();
  const [searchFilters, setSearchFilters] = useState({
    departure: "all",
    destination: "all",
    month: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.departure && searchFilters.departure !== "all") {
      params.set("departure", searchFilters.departure);
    }
    if (searchFilters.destination && searchFilters.destination !== "all") {
      params.set("destination", searchFilters.destination);
    }
    if (searchFilters.month) {
      params.set("month", searchFilters.month);
    }
    
    navigate(`/tours?${params.toString()}`);
  };

  const handleBrowseTours = () => {
    navigate("/tours");
  };

  return (
    <PublicLayout>
      <div className="bg-background text-foreground">
        {/* ================= HERO SECTION ================= */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Discover Group Tours Departing From Your City
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                South India, Char Dham, Kashmir & more — travel together, travel better with verified tour operators
              </p>

              {/* Search Box */}
              <Card className="p-4 md:p-6 shadow-lg border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Departure City</label>
                    <Select
                      value={searchFilters.departure}
                      onValueChange={(value) => setSearchFilters({ ...searchFilters, departure: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {departureCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Destination</label>
                    <Select
                      value={searchFilters.destination}
                      onValueChange={(value) => setSearchFilters({ ...searchFilters, destination: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Destinations</SelectItem>
                        {destinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>
                            {dest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Month</label>
                    <Input
                      type="month"
                      value={searchFilters.month}
                      onChange={(e) => setSearchFilters({ ...searchFilters, month: e.target.value })}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground opacity-0">Search</label>
                    <Button onClick={handleSearch} className="w-full h-10 gap-2">
                      <Search className="h-4 w-4" />
                      Search Tours
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ================= FEATURED TOURS ================= */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Group Tours
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our curated collection of group tours with verified operators
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredTours && featuredTours.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {featuredTours.slice(0, 6).map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              <div className="text-center">
                <Button onClick={handleBrowseTours} size="lg" className="gap-2">
                  Browse All Tours
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No upcoming tours at the moment.
              </p>
              <Button onClick={handleBrowseTours} variant="outline">
                View All Tours
              </Button>
            </div>
          )}
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="bg-muted/50 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why WanderWise Tours?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your trusted partner for group travel experiences
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              <Card className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                    Trusted Tour Operators
                  </h3>
                  <p className="text-muted-foreground">
                    Verified local operators with years of experience in group travel. All operators are carefully vetted for quality and reliability.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                    Departures From Your City
                  </h3>
                  <p className="text-muted-foreground">
                    Raipur, Durg, Bhilai & nearby cities — no more travel confusion. Convenient pick-up points near you.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IndianRupee className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                    Transparent Pricing
                  </h3>
                  <p className="text-muted-foreground">
                    No hidden charges. Clear inclusions & exclusions. Know exactly what you're paying for.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================= KEY FEATURES ================= */}
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              What Makes Us Different
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Verified Operators</h3>
                  <p className="text-muted-foreground">
                    Every tour operator is verified and rated by previous travelers
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Group Travel Benefits</h3>
                  <p className="text-muted-foreground">
                    Travel with like-minded people and enjoy group discounts
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Flexible Dates</h3>
                  <p className="text-muted-foreground">
                    Multiple departure dates to choose from throughout the year
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Safe & Secure</h3>
                  <p className="text-muted-foreground">
                    Your safety and comfort are our top priorities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Plan Your Next Group Trip?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore upcoming tours and travel stress-free with WanderWise. Join thousands of happy travelers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleBrowseTours} size="lg" className="gap-2">
                Browse All Tours
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => navigate("/contact")} variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Index;
