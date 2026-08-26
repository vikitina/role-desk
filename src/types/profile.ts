import type { Role } from "./role";

export interface UserProfile {
  id: string;
  role_id: string;
  display_name: string;
  created_at: string;
  updated_at: string;

  role: Role;
}
