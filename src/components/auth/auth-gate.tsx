import { useEffect } from "react";

import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/auth.store";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({
  children,
}: AuthGateProps) {
  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const initialize = useAuthStore(
    (state) => state.initialize
  );

  const setSession = useAuthStore(
    (state) => state.setSession
  );

  const loadUserData = useAuthStore(
    (state) => state.loadUserData
  );

  useEffect(() => {
    let mounted = true;

    /*
     * 1. Первичная инициализация.
     *
     * Здесь получаем существующую session
     * при запуске приложения.
     */
    initialize();

    /*
     * 2. Слушаем изменения состояния Auth.
     *
     * ВАЖНО:
     * внутри callback НЕ делаем await
     * Supabase-запросов.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        /*
         * Сохраняем session в Zustand.
         */
        setSession(session);

        /*
         * Если пользователь авторизовался,
         * загружаем profile и permissions
         * отдельно от auth callback.
         */
        if (session) {
          setTimeout(() => {
            if (mounted) {
              loadUserData();
            }
          }, 0);
        }
      }
    );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, [
    initialize,
    setSession,
    loadUserData,
  ]);

  if (!initialized) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return children;
}