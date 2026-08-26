import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/button";
import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";
import { registerUser } from "../../services/auth.service";

import styles from "./register-page.module.scss";

export default function RegisterPage() {
  const language = useLanguageStore(
    (state) => state.language
  );

  const navigate = useNavigate();

  const t = (key: string) =>
    getTranslation(language, key);

  const [name, setName] = useState("");
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
      const data = await registerUser({
        name,
        email,
        password,
      });

      /*
       * Если email confirmation включён
       * в Supabase, session будет null.
       */
      if (!data.session) {
        navigate("/login");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <p className={styles.eyebrow}>
          {t("register.eyebrow")}
        </p>

        <h1 className={styles.title}>
          {t("register.title")}
        </h1>

        <p className={styles.description}>
          {t("register.description")}
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <label className={styles.field}>
            <span className={styles.label}>
              {t("register.name")}
            </span>

            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {t("register.email")}
            </span>

            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {t("register.password")}
            </span>

            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={6}
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
              ? "Creating..."
              : t("register.submit")}
          </Button>
        </form>

        <p className={styles.footer}>
          {t("register.haveAccount")}{" "}

          <Link
            className={styles.link}
            to="/login"
          >
            {t("register.login")}
          </Link>
        </p>
      </div>
    </section>
  );
}