import { useParams } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { EnquiryForm } from "@/components/tours/EnquiryForm";
import { useTour } from "@/hooks/useTours";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export default function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id || "");

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (error || !tour) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Tour Not Found
          </h1>
          <p className="text-muted-foreground">
            The tour you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </PublicLayout>
    );
  }

  const images = tour.tour_images || [];
  const itinerary = tour.tour_itinerary?.sort((a, b) => a.day_number - b.day_number) || [];
  const operator = tour.operator;

  const primaryImage = images[0]?.image_url ||
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80";

  const whatsappLink = operator?.phone
    ? `https://wa.me/91${operator.phone.replace(/\D/g, "")}?text=Hi, I'm interested in the tour: ${tour.title}`
    : "#";

  return (
    <PublicLayout>
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={primaryImage}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <Badge variant="default" className="mb-4 capitalize">
              {tour.status}
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              {tour.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-primary-foreground/90">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {tour.departure_city} → {tour.destination}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {tour.duration_days} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Tour Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {tour.description || "Experience an unforgettable journey with our carefully crafted tour package."}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dates</p>
                      <p className="font-medium">
                        {format(new Date(tour.start_date), "dd MMM")} - {format(new Date(tour.end_date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Availability</p>
                      <p className="font-medium">{tour.seats_available} / {tour.seats_total} seats</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operator Info */}
            {operator && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Tour Operator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-foreground">{operator.name}</p>
                  <p className="text-sm text-muted-foreground">{operator.city}</p>
                  {operator.verified && (
                    <Badge variant="secondary" className="mt-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Day-wise Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {itinerary.map((day) => (
                      <AccordionItem key={day.id} value={day.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <span className="flex items-center gap-3">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                              {day.day_number}
                            </span>
                            <span className="font-medium text-left">{day.title}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-11 text-muted-foreground">
                          {day.description || "Details will be shared closer to the departure date."}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Inclusions/Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Inclusions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-1 shrink-0" />
                      AC Bus travel throughout the tour
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-1 shrink-0" />
                      Hotel accommodation (twin sharing)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-1 shrink-0" />
                      Breakfast, Lunch & Dinner
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-1 shrink-0" />
                      Sightseeing as per itinerary
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    Exclusions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                      Personal expenses
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                      Camera fees at monuments
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                      Tips and gratuities
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive mt-1 shrink-0" />
                      Any activity not mentioned
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Price per person</p>
                  <p className="text-4xl font-bold text-primary flex items-center justify-center">
                    <IndianRupee className="h-8 w-8" />
                    {tour.price_per_person.toLocaleString()}
                  </p>
                </div>

                {operator?.phone && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mb-4 bg-[#25D366] hover:bg-[#128C7E] text-primary-foreground">
                      <Phone className="mr-2 h-5 w-5" />
                      WhatsApp Enquiry
                    </Button>
                  </a>
                )}

                <div className="border-t border-border pt-6">
                  <h3 className="font-display font-semibold mb-4">Quick Enquiry</h3>
                  <EnquiryForm tourId={tour.id} tourTitle={tour.title} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}