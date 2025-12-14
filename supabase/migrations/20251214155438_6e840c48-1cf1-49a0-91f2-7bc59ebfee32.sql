-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'operator', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- RLS policy for user_roles - only admins can view all
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

-- Update existing table policies to use the new is_admin function
DROP POLICY IF EXISTS "Admins have full access to operators" ON public.operators;
DROP POLICY IF EXISTS "Admins have full access to tours" ON public.tours;
DROP POLICY IF EXISTS "Admins have full access to itinerary" ON public.tour_itinerary;
DROP POLICY IF EXISTS "Admins have full access to images" ON public.tour_images;
DROP POLICY IF EXISTS "Admins have full access to enquiries" ON public.enquiries;

-- Recreate admin policies using the is_admin function
CREATE POLICY "Admins have full access to operators" ON public.operators
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to tours" ON public.tours
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to itinerary" ON public.tour_itinerary
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to images" ON public.tour_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to enquiries" ON public.enquiries
  FOR ALL USING (public.is_admin());

-- Allow enquiries to be read by tour owners (for public display count)
CREATE POLICY "Public can view enquiry counts" ON public.enquiries
  FOR SELECT USING (true);