import {
  Database,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuthStore } from "../../stores/auth.store";
import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";

import styles from "./dashboard-page.module.scss";

export default function DashboardPage() {
  const language = useLanguageStore(
    (state) => state.language
  );

  const hasPermission = useAuthStore(
    (state) => state.hasPermission
  );

  const t = (key: string) =>
    getTranslation(language, key);

  const cards = [
    {
      icon: Users,
      title: t("dashboard.cards.users.title"),
      description: t(
        "dashboard.cards.users.description"
      ),
      permission: "users.read",
      to: "/users",
    },

    {
      icon: ShieldCheck,
      title: t("dashboard.cards.roles.title"),
      description: t(
        "dashboard.cards.roles.description"
      ),
      permission: "roles.read",
      to: "/roles",
    },

    {
      icon: Database,
      title: t("dashboard.cards.permissions.title"),
      description: t(
        "dashboard.cards.permissions.description"
      ),
      permission: "permissions.read",
      to: "/permissions",
    },
  ];

  const availableCards = cards.filter((card) =>
    hasPermission(card.permission)
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {t("dashboard.eyebrow")}
          </p>

          <h1 className={styles.title}>
            {t("dashboard.title")}
          </h1>

          <p className={styles.description}>
            {t("dashboard.description")}
          </p>
        </header>

        {availableCards.length > 0 && (
          <section className={styles.grid}>
            {availableCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.permission}
                  to={card.to}
                  className={styles.card}
                >
                  <div className={styles.icon}>
                    <Icon size={20} />
                  </div>

                  <h2 className={styles.cardTitle}>
                    {card.title}
                  </h2>

                  <p className={styles.cardDescription}>
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </section>
        )}

        {availableCards.length === 0 && (
          <div className={styles.empty}>
            <p>
              {t("dashboard.noAccess")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}