import { useAuthStore } from "../stores/auth.store";

export function usePermission(
  permission: string
): boolean {
  return useAuthStore((state) =>
    state.hasPermission(permission)
  );
}