import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods":
    "GET, PATCH, OPTIONS",
};

const supabaseUrl =
  Deno.env.get("SUPABASE_URL")!;

const supabaseAnonKey =
  Deno.env.get("SUPABASE_ANON_KEY")!;

const supabaseServiceRoleKey =
  Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY"
  )!;

/*
 * Service-role client.
 *
 * Используется только внутри Edge Function.
 */
const adminClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

/*
 * Client с JWT текущего пользователя.
 *
 * Нужен для определения того,
 * кто выполняет запрос.
 */
function createUserClient(
  authorization: string
) {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    }
  );
}

/*
 * Унифицированный JSON response.
 */
function jsonResponse(
  data: unknown,
  status = 200
) {
  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {
        ...corsHeaders,

        "Content-Type":
          "application/json",
      },
    }
  );
}

/*
 * Проверяем permission текущего пользователя.
 */
async function checkPermission(
  authorization: string,
  permissionCode: string
) {
  const userClient =
    createUserClient(authorization);

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return {
      allowed: false,
      user: null,
    };
  }

  /*
   * Получаем профиль пользователя
   * и его role_id.
   */
  const {
    data: profile,
    error: profileError,
  } = await adminClient
    .from("role_desk_profiles")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      allowed: false,
      user,
    };
  }

  /*
   * Проверяем наличие permission
   * у роли пользователя.
   */
  const {
    data: permission,
    error: permissionError,
  } = await adminClient
    .from("role_desk_role_permissions")
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

  if (permissionError) {
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
    allowed: Boolean(permission),
    user,
  };
}

/*
 * Получить одну роль.
 */
async function getRole(
  roleId: string
) {
  const {
    data,
    error,
  } = await adminClient
    .from("role_desk_roles")
    .select(`
      id,
      code,
      name,
      description,
      is_system,
      created_at,
      updated_at
    `)
    .eq("id", roleId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/*
 * Получить все роли.
 */
async function getRoles() {
  const {
    data,
    error,
  } = await adminClient
    .from("role_desk_roles")
    .select(`
      id,
      code,
      name,
      description,
      is_system,
      created_at,
      updated_at
    `)
    .order("name", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

/*
 * Получить все permissions.
 */
async function getAllPermissions() {
  const {
    data,
    error,
  } = await adminClient
    .from("role_desk_permissions")
    .select(`
      id,
      code,
      name,
      description,
      created_at
    `)
    .order("code");

  if (error) {
    throw error;
  }

  return data;
}

/*
 * Получить permissions конкретной роли.
 */
async function getRolePermissions(
  roleId: string
) {
  const {
    data,
    error,
  } = await adminClient
    .from(
      "role_desk_role_permissions"
    )
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
    .eq(
      "role_id",
      roleId
    );

  if (error) {
    throw error;
  }

  return data
    .map(
      (item) =>
        item.role_desk_permissions
    )
    .filter(Boolean);
}

/*
 * Собираем полную информацию
 * о конкретной роли.
 */
async function buildRoleResponse(
  roleId: string
) {
  const role =
    await getRole(roleId);

  const permissions =
    await getRolePermissions(
      roleId
    );

  return {
    role,
    permissions,
  };
}

/*
 * Главный Edge Function handler.
 */
Deno.serve(async (request) => {
  /*
   * CORS preflight.
   */
  if (
    request.method ===
    "OPTIONS"
  ) {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    /*
     * Получаем JWT.
     */
    const authorization =
      request.headers.get(
        "Authorization"
      );

    if (!authorization) {
      return jsonResponse(
        {
          error:
            "Missing Authorization header.",
        },
        401
      );
    }

    /*
     * Определяем URL.
     *
     * Возможные варианты:
     *
     * /functions/v1/roles
     * /functions/v1/roles/:roleId
     */
    const url = new URL(
      request.url
    );

    const pathParts =
      url.pathname
        .split("/")
        .filter(Boolean);

    const roleId =
      pathParts.at(-1);

    const isRoleList =
      !roleId ||
      roleId === "roles";

    /*
     * =====================================================
     * GET /roles
     * =====================================================
     *
     * Получение списка всех ролей.
     *
     * Требуется:
     *
     * roles.read
     */
    if (
      request.method === "GET" &&
      isRoleList
    ) {
      const permission =
        await checkPermission(
          authorization,
          "roles.read"
        );

      if (!permission.allowed) {
        return jsonResponse(
          {
            error:
              "You do not have permission to read roles.",
          },
          403
        );
      }

      const roles =
        await getRoles();

      return jsonResponse(
        roles
      );
    }

    /*
     * =====================================================
     * GET /roles/:roleId
     * =====================================================
     *
     * Получение одной роли
     * вместе с её permissions.
     *
     * Требуется:
     *
     * roles.read
     */
    if (
      request.method === "GET" &&
      !isRoleList
    ) {
      const permission =
        await checkPermission(
          authorization,
          "roles.read"
        );

      if (!permission.allowed) {
        return jsonResponse(
          {
            error:
              "You do not have permission to read roles.",
          },
          403
        );
      }

      const result =
        await buildRoleResponse(
          roleId
        );

      return jsonResponse(
        result
      );
    }

    /*
     * =====================================================
     * PATCH /roles/:roleId
     * =====================================================
     *
     * Изменение permissions роли.
     *
     * Требуется:
     *
     * roles.update
     */
    if (
      request.method === "PATCH"
    ) {
      if (isRoleList) {
        return jsonResponse(
          {
            error:
              "Role id is required.",
          },
          400
        );
      }

      const permission =
        await checkPermission(
          authorization,
          "roles.update"
        );

      if (!permission.allowed) {
        return jsonResponse(
          {
            error:
              "You do not have permission to update roles.",
          },
          403
        );
      }

      const body =
        await request.json();

      const permissionIds =
        body.permission_ids;

      /*
       * permission_ids должен
       * быть массивом.
       */
      if (
        !Array.isArray(
          permissionIds
        )
      ) {
        return jsonResponse(
          {
            error:
              "permission_ids must be an array.",
          },
          400
        );
      }

      /*
       * Проверяем существование роли.
       */
      const role =
        await getRole(roleId);

      if (!role) {
        return jsonResponse(
          {
            error:
              "Role not found.",
          },
          404
        );
      }

      /*
       * Проверяем существование
       * каждого permission.
       */
      if (
        permissionIds.length >
        0
      ) {
        const {
          data: permissions,
          error:
            permissionsError,
        } = await adminClient
          .from(
            "role_desk_permissions"
          )
          .select("id")
          .in(
            "id",
            permissionIds
          );

        if (permissionsError) {
          throw permissionsError;
        }

        if (
          permissions.length !==
          permissionIds.length
        ) {
          return jsonResponse(
            {
              error:
                "One or more permissions do not exist.",
            },
            400
          );
        }
      }

      /*
       * Удаляем старые permissions.
       */
      const {
        error: deleteError,
      } = await adminClient
        .from(
          "role_desk_role_permissions"
        )
        .delete()
        .eq(
          "role_id",
          roleId
        );

      if (deleteError) {
        throw deleteError;
      }

      /*
       * Создаём новые связи.
       */
      if (
        permissionIds.length >
        0
      ) {
        const rows =
          permissionIds.map(
            (
              permissionId: string
            ) => ({
              role_id: roleId,

              permission_id:
                permissionId,
            })
          );

        const {
          error: insertError,
        } = await adminClient
          .from(
            "role_desk_role_permissions"
          )
          .insert(rows);

        if (insertError) {
          throw insertError;
        }
      }

      /*
       * Возвращаем обновлённую
       * роль и permissions.
       */
      const result =
        await buildRoleResponse(
          roleId
        );

      return jsonResponse(
        result
      );
    }

    /*
     * Всё остальное.
     */
    return jsonResponse(
      {
        error:
          "Method not allowed.",
      },
      405
    );
  } catch (error) {
    console.error(
      "Roles function error:",
      error
    );

    return jsonResponse(
      {
        error:
          "Internal server error.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      500
    );
  }
});