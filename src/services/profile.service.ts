import { supabase } from "../lib/supabase";

import type { UserProfile } from "../types/profile";

export async function getCurrentProfile(): Promise<UserProfile> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { data, error } = await supabase
    .from("role_desk_profiles")
    .select(`
      id,
      role_id,
      display_name,
      created_at,
      updated_at,
      role:role_desk_roles (
        id,
        code,
        name,
        description,
        is_system,
        created_at,
        updated_at
      )
    `)
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data as UserProfile;
}