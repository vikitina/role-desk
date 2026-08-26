import { supabase } from "../lib/supabase";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function registerUser({
  name,
  email,
  password,
}: RegisterData) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function loginUser({
  email,
  password,
}: LoginData) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function logoutUser() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}