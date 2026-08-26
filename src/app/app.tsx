import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useThemeStore } from "../stores/theme.store";
import { useEffect } from "react";
import { AuthGate } from "../components/auth";

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <AuthGate>
      <RouterProvider router={router} />
    </AuthGate >
  )
};