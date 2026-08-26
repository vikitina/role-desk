import { useLanguageStore } from "../../../stores/language.store";
import { getTranslation } from "../../../i18n";
import styles from "./footer.module.scss";

export default function Footer() {
  const language = useLanguageStore((state) => state.language);

  const t = (key: string) => getTranslation(language, key);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>{t("footer.text")}</span>

        <span>
          React · TypeScript · Supabase
        </span>
      </div>
    </footer>
  );
}