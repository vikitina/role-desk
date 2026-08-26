import { supabase } from "../lib/supabase";

import type { Permission } from "../types/permission";
import type { Role } from "../types/role";

export interface RoleDetails {
  role: Role;
  permissions: Permission[];
}

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session) {
    throw new Error("User is not authenticated");
  }

  return session.access_token;
}

/**
 * Получить список всех ролей.
 *
 * Используется, например, при создании пользователя,
 * чтобы администратор мог выбрать роль.
 */
export async function getRoles(): Promise<Role[]> {
  const token = await getAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roles`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env
          .VITE_SUPABASE_ANON_KEY,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to load roles."
    );
  }

  return data as Role[];
}

/**
 * Получить роль вместе со всеми её permissions.
 */
export async function getRoleDetails(
  roleId: string
): Promise<RoleDetails> {
  const token = await getAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roles/${roleId}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env
          .VITE_SUPABASE_ANON_KEY,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to load role."
    );
  }

  return data as RoleDetails;
}

/**
 * Обновить permissions роли.
 *
 * Само право на изменение проверяется
 * внутри Edge Function.
 */
export async function updateRolePermissions(
  roleId: string,
  permissionIds: string[]
): Promise<RoleDetails> {
  const token = await getAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/roles/${roleId}`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env
          .VITE_SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        permission_ids: permissionIds,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to update role permissions."
    );
  }

  return data as RoleDetails;
}