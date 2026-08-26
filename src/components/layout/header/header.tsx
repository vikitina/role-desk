import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";

import { IconButton } from "../../ui/icon-button/icon-button";
import Button from "../../ui/button";

import { useThemeStore } from "../../../stores/theme.store";
import { useLanguageStore } from "../../../stores/language.store";
import { useAuthStore } from "../../../stores/auth.store";

import { getTranslation } from "../../../i18n";

import styles from "./header.module.scss";

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();

  const { language, setLanguage } =
    useLanguageStore();

  const session = useAuthStore(
    (state) => state.session
  );

  const profile = useAuthStore(
    (state) => state.profile
  );

  const signOut = useAuthStore(
    (state) => state.signOut
  );

  const [loggingOut, setLoggingOut] =
    useState(false);

  const navigate = useNavigate();

  const t = (key: string) =>
    getTranslation(language, key);

  const isAuthenticated = Boolean(session);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await signOut();

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const userName =
    profile?.display_name ??
    session?.user?.email ??
    "User";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.logo}
        >
          RoleDesk
        </Link>

        <nav className={styles.navigation}>
          <Link to="/">
            {t("navigation.home")}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                {t("navigation.dashboard")}
              </Link>

              <Link
                to="/profile"
                className={styles.profileLink}
              >
                {userName}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                {t("navigation.login")}
              </Link>

              <Link to="/register">
                {t("navigation.register")}
              </Link>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          <div className={styles.languageSwitcher}>
            <button
              type="button"
              className={
                language === "en"
                  ? `${styles.languageItem} ${styles.languageItemActive}`
                  : styles.languageItem
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              EN
            </button>

            <button
              type="button"
              className={
                language === "uk"
                  ? `${styles.languageItem} ${styles.languageItemActive}`
                  : styles.languageItem
              }
              onClick={() =>
                setLanguage("uk")
              }
            >
              UA
            </button>
          </div>

          <IconButton
            label={
              theme === "light"
                ? t("theme.dark")
                : t("theme.light")
            }
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </IconButton>

          {isAuthenticated && (
            <Button
              variant="secondary"
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={16} />

              {loggingOut
                ? "..."
                : t("navigation.logout")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}