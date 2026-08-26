import {
  ArrowRight,
  Database,
  Languages,
  LockKeyhole,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";


import { Link } from "react-router-dom";

import Button from "../../components/ui/button";
import { useLanguageStore } from "../../stores/language.store";
import { getTranslation } from "../../i18n";

import styles from "./home-page.module.scss";

import { useAuthStore } from "../../stores/auth.store";
import {supabase} from '../../lib/supabase'
import { useEffect } from "react";

export default function HomePage() {

const session = useAuthStore(
  (state) => state.session
);

const profile = useAuthStore(
  (state) => state.profile
);

const permissions = useAuthStore(
  (state) => state.permissions
);

useEffect(() => {
  async function checkAuth() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("SUPABASE SESSION:", session);
    console.log("SUPABASE SESSION ERROR:", error);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("SUPABASE USER:", user);
    console.log("SUPABASE USER ERROR:", userError);
  }

  checkAuth();
}, []);
  const language = useLanguageStore((state) => state.language);

  const t = (key: string) => getTranslation(language, key);

  const features = [
    {
      icon: LockKeyhole,
      title: t("home.features.authentication.title"),
      description: t(
        "home.features.authentication.description"
      ),
    },
    {
      icon: Users,
      title: t("home.features.authorization.title"),
      description: t(
        "home.features.authorization.description"
      ),
    },
    {
      icon: ShieldCheck,
      title: t("home.features.permissions.title"),
      description: t(
        "home.features.permissions.description"
      ),
    },
    {
      icon: Database,
      title: t("home.features.security.title"),
      description: t(
        "home.features.security.description"
      ),
    },
    {
      icon: Pencil,
      title: t("home.features.crud.title"),
      description: t("home.features.crud.description"),
    },
    {
      icon: Languages,
      title: t("home.features.architecture.title"),
      description: t(
        "home.features.architecture.description"
      ),
    },
  ];

  const roles = [
    {
      name: t("home.roles.administrator.name"),
      description: t(
        "home.roles.administrator.description"
      ),
    },
    {
      name: t("home.roles.manager.name"),
      description: t("home.roles.manager.description"),
    },
    {
      name: t("home.roles.viewer.name"),
      description: t("home.roles.viewer.description"),
    },
  ];

  return (
    <div className={styles.home}>

<pre>
  {JSON.stringify(
    {
      hasSession: Boolean(session),
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? null,
      profile,
      permissions,
    },
    null,
    2
  )}
</pre>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              {t("home.eyebrow")}
            </p>

            <h1 className={styles.heroTitle}>
              {t("home.title")}
            </h1>

            <p className={styles.heroDescription}>
              {t("home.description")}
            </p>

            <div className={styles.heroActions}>
              <Link to="/login">
                <Button>
                  {t("home.primaryAction")}

                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="secondary">
                  {t("common.register")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>
              01 / FEATURES
            </p>

            <h2 className={styles.sectionTitle}>
              {t("home.featuresTitle")}
            </h2>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className={styles.featureCard}
                  key={feature.title}
                >
                  <div className={styles.featureIcon}>
                    <Icon size={20} />
                  </div>

                  <h3 className={styles.featureTitle}>
                    {feature.title}
                  </h3>

                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>
              02 / ACCESS
            </p>

            <h2 className={styles.sectionTitle}>
              {t("home.rolesTitle")}
            </h2>

            <p className={styles.sectionDescription}>
              {t("home.rolesDescription")}
            </p>
          </div>

          <div className={styles.rolesGrid}>
            {roles.map((role, index) => (
              <article
                className={styles.roleCard}
                key={role.name}
              >
                <span className={styles.roleNumber}>
                  0{index + 1}
                </span>

                <h3 className={styles.roleTitle}>
                  {role.name}
                </h3>

                <p className={styles.roleDescription}>
                  {role.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div>
              <p className={styles.eyebrow}>
                03 / GET STARTED
              </p>

              <h2 className={styles.ctaTitle}>
                {t("home.invitationTitle")}
              </h2>

              <p className={styles.ctaDescription}>
                {t("home.invitationDescription")}
              </p>
            </div>

            <Link to="/login">
              <Button>
                {t("common.login")}

                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}