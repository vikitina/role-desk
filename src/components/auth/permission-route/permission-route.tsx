import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../../stores/auth.store";

interface PermissionRouteProps {
  permission: string;
}

export default function PermissionRoute({
  permission,
}: PermissionRouteProps) {
  const hasPermission = useAuthStore(
    (state) => state.hasPermission
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  if (!initialized) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}