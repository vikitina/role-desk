import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";

import { getRoles } from "../../services/role.service";

import type { Role } from "../../types/role";

import styles from "./roles-page.module.scss";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export default function RolesPage() {
  const language = useLanguageStore(
    (state) => state.language
  );

  const t = (key: string) =>
    getTranslation(language, key);

  const [roles, setRoles] = useState<Role[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const hasPermission = useAuthStore(
    (state) => state.hasPermission
  );    

  useEffect(() => {
    async function loadRoles() {
      try {
        setLoading(true);
        setError(null);

        const data = await getRoles();

        setRoles(data);
      } catch (error) {
        console.error(
          "Failed to load roles:",
          error
        );

        setError(
          t("roles.loadError")
        );
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, [language]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {t("roles.eyebrow")}
          </p>

          <h1 className={styles.title}>
            {t("roles.title")}
          </h1>

          <p className={styles.description}>
            {t("roles.description")}
          </p>
        </header>

        <section className={styles.content}>
          {loading && (
            <div className={styles.state}>
              {t("roles.loading")}
            </div>
          )}

          {!loading && error && (
            <div className={styles.state}>
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            roles.length === 0 && (
              <div className={styles.state}>
                {t("roles.empty")}
              </div>
            )}

          {!loading &&
            !error &&
            roles.length > 0 && (
              <div className={styles.grid}>
                {roles.map((role) => (
                  <article
                    className={styles.card}
                    key={role.id}
                  >
                    <div
                      className={
                        styles.cardHeader
                      }
                    >
                      <div
                        className={
                          styles.icon
                        }
                      >
                        <ShieldCheck
                          size={18}
                        />
                      </div>

                      {role.is_system && (
                        <span
                          className={
                            styles.badge
                          }
                        >
                          {t(
                            "roles.system"
                          )}
                        </span>
                      )}
                    </div>

                    <p
                      className={
                        styles.code
                      }
                    >
                      {role.code}
                    </p>

                    <h2
                      className={
                        styles.name
                      }
                    >
                      {role.name}
                    </h2>

                    <p
                      className={
                        styles.roleDescription
                      }
                    >
                      {role.description}
                    </p>

                    {hasPermission("roles.update") && (<Link
                      to={`/roles/${role.id}`}
                      className={styles.link}
                    >
                      {t("roles.editPermissions")}
                    </Link>
                    )}
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}