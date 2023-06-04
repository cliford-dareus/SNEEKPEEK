import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";

export function PrivateOutlet() {
  const auth = useAuth();
  const location = useLocation();

  return auth.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}
