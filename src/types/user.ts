import type { Role } from "./role";

export interface User {
  id: string;
  display_name: string;
  role_id: string;

  created_at: string;
  updated_at: string;

  role: Role;
}