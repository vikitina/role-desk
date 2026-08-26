import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get(
  "SUPABASE_URL"
)!;

const supabaseAnonKey = Deno.env.get(
  "SUPABASE_ANON_KEY"
)!;

const supabaseServiceRoleKey =
  Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY"
  )!;

/*
 * Client that works with the JWT
 * of the currently authenticated user.
 */
export function createUserClient(
  authorization: string
) {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: {
          Authorization:
            authorization,
        },
      },
    }
  );
}

/*
 * Service-role client.
 *
 * IMPORTANT:
 * This client must only be used
 * inside Edge Functions.
 */
export const adminClient =
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey
  );