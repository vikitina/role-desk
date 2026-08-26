import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/button";
import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";
import { loginUser } from "../../services/auth.service";

import styles from "./login-page.module.scss";

export default function LoginPage() {
  const language = useLanguageStore(
    (state) => state.language
  );

  const navigate = useNavigate();

  const t = (key: string) =>
    getTranslation(language, key);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await loginUser({
        email,
        password,
      });

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <p className={styles.eyebrow}>
          {t("login.eyebrow")}
        </p>

        <h1 className={styles.title}>
          {t("login.title")}
        </h1>

        <p className={styles.description}>
          {t("login.description")}
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <label className={styles.field}>
            <span className={styles.label}>
              {t("login.email")}
            </span>

            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="demo@example.com"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {t("login.password")}
            </span>

            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : t("login.submit")}
          </Button>
        </form>

        <p className={styles.footer}>
          {t("login.noAccount")}{" "}

          <Link
            className={styles.link}
            to="/register"
          >
            {t("login.createAccount")}
          </Link>
        </p>
      </div>
    </section>
  );
}