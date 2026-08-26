import { supabase } from "../lib/supabase";

import type { Permission } from "../types/permission";

export async function getCurrentUserPermissions(): Promise<
  Permission[]
> {
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

  // 1. Получаем профиль пользователя
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("role_desk_profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  // 2. Получаем permissions роли
  const {
    data: rolePermissions,
    error: rolePermissionsError,
  } = await supabase
    .from("role_desk_role_permissions")
    .select(`
      permission_id,
      role_desk_permissions (
        id,
        code,
        name,
        description,
        created_at
      )
    `)
    .eq("role_id", profile.role_id);

  if (rolePermissionsError) {
    throw rolePermissionsError;
  }

  return rolePermissions
    .map((item) => item.role_desk_permissions)
    .filter(Boolean) as Permission[];
}