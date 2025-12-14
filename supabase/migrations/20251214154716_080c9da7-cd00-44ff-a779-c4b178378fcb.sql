-- Create operators table
CREATE TABLE public.operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  description TEXT,
  verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tours table
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES public.operators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  departure_city TEXT NOT NULL,
  destination TEXT NOT NULL,
  tour_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  price_per_person NUMERIC NOT NULL,
  seats_total INTEGER NOT NULL,
  seats_available INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour_itinerary table
CREATE TABLE public.tour_itinerary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);

-- Create tour_images table
CREATE TABLE public.tour_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for operators (active only)
CREATE POLICY "Public can view active operators" ON public.operators
  FOR SELECT USING (status = 'active');

-- Public read access for tours (upcoming/ongoing only)
CREATE POLICY "Public can view published tours" ON public.tours
  FOR SELECT USING (status IN ('upcoming', 'ongoing'));

-- Public read access for itinerary
CREATE POLICY "Public can view tour itinerary" ON public.tour_itinerary
  FOR SELECT USING (true);

-- Public read access for images
CREATE POLICY "Public can view tour images" ON public.tour_images
  FOR SELECT USING (true);

-- Public can create enquiries
CREATE POLICY "Public can create enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Admin full access policies (using service role or authenticated admin)
CREATE POLICY "Admins have full access to operators" ON public.operators
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to tours" ON public.tours
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to itinerary" ON public.tour_itinerary
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to images" ON public.tour_images
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to enquiries" ON public.enquiries
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');