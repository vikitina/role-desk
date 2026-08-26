import { Link } from "react-router-dom";

import Button from "../../components/ui/button";
import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";

import styles from "./not-found-page.module.scss";

export default function NotFoundPage() {
  const language = useLanguageStore((state) => state.language);

  const t = (key: string) => getTranslation(language, key);

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>
          {t("notFound.eyebrow")}
        </p>

        <span className={styles.code}>404</span>

        <h1 className={styles.title}>
          {t("notFound.title")}
        </h1>

        <p className={styles.description}>
          {t("notFound.description")}
        </p>

        <Link to="/" className={styles.action}>
          <Button>
            {t("common.backHome")}
          </Button>
        </Link>
      </div>
    </section>
  );
}