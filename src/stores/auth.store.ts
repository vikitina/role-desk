import { create } from "zustand";

import { supabase } from "../lib/supabase";
import { getCurrentProfile } from "../services/profile.service";
import { getCurrentUserPermissions } from "../services/permission.service";

import type { Session } from "@supabase/supabase-js";
import type { UserProfile } from "../types/profile";
import type { Permission } from "../types/permission";

interface AuthState {
  session: Session | null;
  profile: UserProfile | null;
  permissions: Permission[];

  initialized: boolean;
  loading: boolean;

  initialize: () => Promise<void>;
  setSession: (session: Session | null) => void;
  loadUserData: () => Promise<void>;
  signOut: () => Promise<void>;

  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>(
  (set, get) => ({
    session: null,
    profile: null,
    permissions: [],

    initialized: false,
    loading: false,

    /*
     * Первоначальная инициализация приложения.
     *
     * Здесь мы один раз получаем существующую
     * Supabase session.
     */
    initialize: async () => {
      set({ loading: true });

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        set({
          session,
        });

        if (session) {
          await get().loadUserData();
        } else {
          set({
            profile: null,
            permissions: [],
          });
        }
      } catch (error) {
        console.error(
          "Auth initialization failed:",
          error
        );

        set({
          session: null,
          profile: null,
          permissions: [],
        });
      } finally {
        set({
          initialized: true,
          loading: false,
        });
      }
    },

    /*
     * Просто сохраняем session.
     *
     * Никаких Supabase-запросов здесь нет.
     */
    setSession: (session) => {
      set({
        session,
      });

      if (!session) {
        set({
          profile: null,
          permissions: [],
        });
      }
    },

    /*
     * Отдельная загрузка бизнес-данных
     * авторизованного пользователя.
     */
    loadUserData: async () => {
      const session = get().session;

      if (!session) {
        set({
          profile: null,
          permissions: [],
        });

        return;
      }

      set({
        loading: true,
      });

      try {
        const profile = await getCurrentProfile();

        const permissions =
          await getCurrentUserPermissions();

        set({
          profile,
          permissions,
        });
      } catch (error) {
        console.error(
          "Failed to load user data:",
          error
        );

        /*
         * Session остаётся.
         *
         * Ошибка загрузки profile/permissions
         * не означает, что пользователь вышел.
         */
        set({
          profile: null,
          permissions: [],
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    signOut: async () => {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      set({
        session: null,
        profile: null,
        permissions: [],
      });
    },

    hasPermission: (permission) => {
      return get().permissions.some(
        (item) => item.code === permission
      );
    },
  })
);