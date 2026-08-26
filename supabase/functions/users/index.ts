import {
  corsHeaders,
  jsonResponse,
} from "../_shared/cors.ts";

import {
  adminClient,
} from "../_shared/supabase.ts";

import {
  checkPermission,
} from "../_shared/permissions.ts";

Deno.serve(async (request) => {
  /*
   * ==========================================
   * CORS
   * ==========================================
   */

  if (
    request.method ===
    "OPTIONS"
  ) {
    return new Response(
      "ok",
      {
        headers:
          corsHeaders,
      }
    );
  }

  try {
    /*
     * ==========================================
     * Authorization
     * ==========================================
     */

    const authorization =
      request.headers.get(
        "Authorization"
      );

    if (!authorization) {
      return jsonResponse(
        {
          error:
            "Missing Authorization header",
        },
        401
      );
    }

    /*
     * ==========================================
     * GET /users
     * ==========================================
     *
     * Requires:
     *
     * users.read
     */

    if (
      request.method ===
      "GET"
    ) {
      const permission =
        await checkPermission(
          authorization,
          "users.read"
        );

      if (
        !permission.allowed
      ) {
        return jsonResponse(
          {
            error:
              "You do not have permission to read users.",
          },
          403
        );
      }

      const {
        data,
        error,
      } = await adminClient
        .from(
          "role_desk_profiles"
        )
        .select(`
          id,
          display_name,
          role_id,
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
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

      if (error) {
        console.error(
          "Failed to load users:",
          error
        );

        return jsonResponse(
          {
            error:
              "Failed to load users.",
            details:
              error.message,
            code:
              error.code,
          },
          500
        );
      }

      return jsonResponse(
        data
      );
    }

    /*
     * ==========================================
     * POST /users
     * ==========================================
     *
     * Requires:
     *
     * users.create
     */

    if (
      request.method ===
      "POST"
    ) {
      const permission =
        await checkPermission(
          authorization,
          "users.create"
        );

      if (
        !permission.allowed
      ) {
        return jsonResponse(
          {
            error:
              "You do not have permission to create users.",
          },
          403
        );
      }

      /*
       * Read request body.
       */

      const body =
        await request.json();

      const {
        email,
        password,
        display_name,
        role_id,
      } = body;

      /*
       * Validate request.
       */

      if (
        !email ||
        !password ||
        !display_name ||
        !role_id
      ) {
        return jsonResponse(
          {
            error:
              "email, password, display_name and role_id are required.",
          },
          400
        );
      }

      /*
       * ==========================================
       * Validate requested role
       * ==========================================
       */

      const {
        data: role,
        error:
          roleError,
      } = await adminClient
        .from(
          "role_desk_roles"
        )
        .select(
          "id, code, name"
        )
        .eq(
          "id",
          role_id
        )
        .single();

      if (
        roleError ||
        !role
      ) {
        return jsonResponse(
          {
            error:
              "Selected role does not exist.",
            details:
              roleError?.message,
            code:
              roleError?.code,
          },
          400
        );
      }

      /*
       * ==========================================
       * Create Auth user
       * ==========================================
       */

      const {
        data: authData,
        error:
          authError,
      } =
        await adminClient.auth.admin.createUser(
          {
            email,
            password,
            email_confirm:
              true,
          }
        );

      if (authError) {
        console.error(
          "Failed to create auth user:",
          authError
        );

        return jsonResponse(
          {
            error:
              authError.message,
            code:
              authError.code,
          },
          400
        );
      }

      const newUser =
        authData.user;

      if (!newUser) {
        return jsonResponse(
          {
            error:
              "User was not created.",
          },
          500
        );
      }

      /*
       * ==========================================
       * Create / update profile
       * ==========================================
       *
       * A database trigger may already
       * have created the profile.
       *
       * Therefore we use UPSERT.
       */

      const {
        data: profile,
        error:
          profileError,
      } = await adminClient
        .from(
          "role_desk_profiles"
        )
        .upsert(
          {
            id: newUser.id,
            role_id,
            display_name,
          },
          {
            onConflict:
              "id",
          }
        )
        .select(`
          id,
          display_name,
          role_id,
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
        .single();

      /*
       * If profile creation/update
       * failed, remove Auth user.
       */

      if (
        profileError ||
        !profile
      ) {
        console.error(
          "Failed to create/update profile:",
          profileError
        );

        await adminClient.auth.admin.deleteUser(
          newUser.id
        );

        return jsonResponse(
          {
            error:
              "Failed to create user profile.",
            details:
              profileError?.message,
            code:
              profileError?.code,
          },
          500
        );
      }

      /*
       * ==========================================
       * Success
       * ==========================================
       */

      return jsonResponse(
        profile,
        201
      );
    }

    /*
     * ==========================================
     * Unsupported method
     * ==========================================
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
      "Unexpected function error:",
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