import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, IndianRupee } from "lucide-react";
import { Tour } from "@/types/database";
import { format } from "date-fns";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const primaryImage = tour.tour_images?.[0]?.image_url || 
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80";

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant={tour.status === 'upcoming' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {tour.status}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <IndianRupee className="h-4 w-4" />
            {tour.price_per_person.toLocaleString()}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 mb-3">
          {tour.title}
        </h3>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{tour.departure_city} → {tour.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(tour.start_date), "dd MMM yyyy")} • {tour.duration_days} Days</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{tour.seats_available} seats available</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/tours/${tour.id}`} className="w-full">
          <Button className="w-full" variant="default">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}