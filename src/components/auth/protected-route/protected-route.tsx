import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../../../stores/auth.store";

export default function ProtectedRoute() {
  const session = useAuthStore(
    (state) => state.session
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const location = useLocation();

  /*
   * AuthGate ещё не закончил первоначальную
   * инициализацию.
   *
   * Не делаем redirect раньше времени.
   */
  if (!initialized) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  /*
   * Пользователь не авторизован.
   *
   * Отправляем на login и сохраняем
   * исходный URL.
   */
  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /*
   * Авторизован → разрешаем
   * вложенный route.
   */
  return <Outlet />;
}