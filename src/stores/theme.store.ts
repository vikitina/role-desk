import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "../types/common";

interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			theme: "light",

			setTheme: (theme) => {
				set({ theme });
			},

			toggleTheme: () => {
				const currentTheme = get().theme;

				set({
					theme: currentTheme === "light" ? "dark" : "light",
				});
			},
		}),
		{
			name: "role-desk-theme",
		}
	)
);