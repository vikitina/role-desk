import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";

import Button from "../../ui/button";

import { useLanguageStore } from "../../../stores/language.store";
import { getTranslation } from "../../../i18n";

import { getRoles } from "../../../services/role.service";
import { createUser } from "../../../services/user.service";

import type { Role } from "../../../types/role";
import type { User } from "../../../types/user";

import styles from "./create-user-modal.module.scss";

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: (user: User) => void;
}

export default function CreateUserModal({
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const language = useLanguageStore(
    (state) => state.language
  );

  const t = (key: string) =>
    getTranslation(language, key);

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] =
    useState(true);

  const [displayName, setDisplayName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [roleId, setRoleId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadRoles() {
      try {
        setRolesLoading(true);

        const data = await getRoles();

        setRoles(data);

        if (data.length > 0) {
          setRoleId(data[0].id);
        }
      } catch (error) {
        console.error(
          "Failed to load roles:",
          error
        );

        setError(
          t("users.create.loadRolesError")
        );
      } finally {
        setRolesLoading(false);
      }
    }

    loadRoles();
  }, [language]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (
      !displayName.trim() ||
      !email.trim() ||
      !password ||
      !roleId
    ) {
      setError(
        t("users.create.validationError")
      );

      return;
    }

    try {
      setLoading(true);

      const user = await createUser({
        display_name:
          displayName.trim(),

        email: email.trim(),

        password,

        role_id: roleId,
      });

      onCreated(user);
    } catch (error) {
      console.error(
        "Failed to create user:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : t("users.create.error")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-user-title"
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              {t("users.create.eyebrow")}
            </p>

            <h2
              id="create-user-title"
              className={styles.title}
            >
              {t("users.create.title")}
            </h2>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X size={18} />
          </button>
        </header>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <label className={styles.field}>
            <span className={styles.label}>
              {t("users.create.name")}
            </span>

            <input
              className={styles.input}
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="name"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {t("users.create.email")}
            </span>

            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {t("users.create.password")}
            </span>

            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="new-password"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {t("users.create.role")}
            </span>

            <select
              className={styles.input}
              value={roleId}
              onChange={(event) =>
                setRoleId(
                  event.target.value
                )
              }
              disabled={
                loading || rolesLoading
              }
            >
              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <div
              className={styles.error}
              role="alert"
            >
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                rolesLoading ||
                !roleId
              }
            >
              {loading
                ? t("users.create.creating")
                : t("users.create.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}