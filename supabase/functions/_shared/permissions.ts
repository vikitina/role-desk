import {
  adminClient,
  createUserClient,
} from "./supabase.ts";

export interface PermissionCheckResult {
  allowed: boolean;
  user: {
    id: string;
    email?: string;
  } | null;
}

/*
 * Check whether the currently authenticated
 * user has a specific permission.
 */
export async function checkPermission(
  authorization: string,
  permissionCode: string
): Promise<PermissionCheckResult> {
  /*
   * Identify the user from their JWT.
   */
  const userClient =
    createUserClient(
      authorization
    );

  const {
    data: {
      user,
    },
    error: userError,
  } = await userClient.auth.getUser();

  if (
    userError ||
    !user
  ) {
    return {
      allowed: false,
      user: null,
    };
  }

  /*
   * Get the user's role.
   */
  const {
    data: profile,
    error: profileError,
  } = await adminClient
    .from("role_desk_profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile
  ) {
    console.error(
      "Failed to load user profile:",
      profileError
    );

    return {
      allowed: false,
      user,
    };
  }

  /*
   * Check whether the role has
   * the requested permission.
   */
  const {
    data: permission,
    error: permissionError,
  } = await adminClient
    .from(
      "role_desk_role_permissions"
    )
    .select(`
      permission_id,
      role_desk_permissions!inner (
        code
      )
    `)
    .eq(
      "role_id",
      profile.role_id
    )
    .eq(
      "role_desk_permissions.code",
      permissionCode
    )
    .maybeSingle();

  if (
    permissionError
  ) {
    console.error(
      "Permission check failed:",
      permissionError
    );

    return {
      allowed: false,
      user,
    };
  }

  return {
    allowed:
      Boolean(permission),
    user,
  };
}