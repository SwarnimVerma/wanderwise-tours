-- Create function to assign default 'user' role to new users
-- This function bypasses RLS using SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.assign_default_user_role(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert 'user' role for the new user
  -- ON CONFLICT handles case where role already exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Add RLS policy to allow users to insert their own role
-- This is needed as a fallback if the function approach doesn't work
CREATE POLICY "Users can insert own role" ON public.user_roles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND role = 'user'::app_role);

-- Create trigger function to automatically assign 'user' role when a new user is created
-- This is the most robust solution as it works automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Automatically assign 'user' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to automatically assign role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

