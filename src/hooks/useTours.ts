import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tour } from "@/types/database";

export function useTours() {
  return useQuery({
    queryKey: ["tours"],
    queryFn: async (): Promise<Tour[]> => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          operator:operators(*),
          tour_images(*),
          tour_itinerary(*)
        `)
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Tour[];
    },
  });
}

export function useTour(id: string) {
  return useQuery({
    queryKey: ["tour", id],
    queryFn: async (): Promise<Tour | null> => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          operator:operators(*),
          tour_images(*),
          tour_itinerary(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Tour | null;
    },
    enabled: !!id,
  });
}

export function useFeaturedTours() {
  return useQuery({
    queryKey: ["tours", "featured"],
    queryFn: async (): Promise<Tour[]> => {
      const { data, error } = await supabase
        .from("tours")
        .select(`
          *,
          operator:operators(*),
          tour_images(*)
        `)
        .in("status", ["upcoming", "ongoing"])
        .order("start_date", { ascending: true })
        .limit(6);

      if (error) throw error;
      return data as Tour[];
    },
  });
}