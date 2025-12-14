export interface Operator {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string;
  email: string | null;
  city: string;
  description: string | null;
  verified: boolean;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Tour {
  id: string;
  operator_id: string | null;
  title: string;
  description: string | null;
  departure_city: string;
  destination: string;
  tour_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  price_per_person: number;
  seats_total: number;
  seats_available: number;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  operator?: Operator;
  tour_images?: TourImage[];
  tour_itinerary?: TourItinerary[];
}

export interface TourItinerary {
  id: string;
  tour_id: string;
  day_number: number;
  title: string;
  description: string | null;
}

export interface TourImage {
  id: string;
  tour_id: string;
  image_url: string;
}

export interface Enquiry {
  id: string;
  tour_id: string;
  name: string;
  phone: string;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  tour?: Tour;
}