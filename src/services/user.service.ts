import { supabase } from "../lib/supabase";

import type { User } from "../types/user";

export interface CreateUserPayload {
  email: string;
  password: string;
  display_name: string;
  role_id: string;
}

export async function getUsers(): Promise<
  User[]
> {
  const {
    data,
    error,
  } = await supabase.functions.invoke(
    "users",
    {
      method: "GET",
    }
  );

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as User[];
}

export async function createUser(
  payload: CreateUserPayload
): Promise<User> {
  const {
    data,
    error,
  } = await supabase.functions.invoke(
    "users",
    {
      method: "POST",
      body: payload,
    }
  );

  if (error) {
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as User;
}