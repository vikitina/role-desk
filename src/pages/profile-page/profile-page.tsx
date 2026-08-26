import { useAuthStore } from "../../stores/auth.store";
import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";

import styles from "./profile-page.module.scss";

export default function ProfilePage() {
  const language = useLanguageStore(
    (state) => state.language
  );

  const profile = useAuthStore(
    (state) => state.profile
  );

  const session = useAuthStore(
    (state) => state.session
  );

  const t = (key: string) =>
    getTranslation(language, key);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {t("profile.eyebrow")}
          </p>

          <h1 className={styles.title}>
            {t("profile.title")}
          </h1>

          <p className={styles.description}>
            {t("profile.description")}
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.row}>
            <span>
              {t("profile.name")}
            </span>

            <strong>
              {profile?.display_name}
            </strong>
          </div>

          <div className={styles.row}>
            <span>
              {t("profile.email")}
            </span>

            <strong>
              {session?.user.email}
            </strong>
          </div>

          <div className={styles.row}>
            <span>
              {t("profile.role")}
            </span>

            <strong>
              {profile?.role?.name}
            </strong>
          </div>
        </section>
      </div>
    </main>
  );
}