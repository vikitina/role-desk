import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Save,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "../../components/ui/button";

import { useLanguageStore } from "../../stores/language.store";
import { useAuthStore } from "../../stores/auth.store";

import { getTranslation } from "../../i18n";

import {
  getRoleDetails,
  updateRolePermissions,
} from "../../services/role.service";

import type { Permission } from "../../types/permission";
import type { Role } from "../../types/role";

import styles from "./role-details-page.module.scss";

export default function RoleDetailsPage() {
  const { roleId } = useParams();

  const navigate = useNavigate();

  const language = useLanguageStore(
    (state) => state.language
  );

  const hasPermission = useAuthStore(
    (state) => state.hasPermission
  );

  const t = (key: string) =>
    getTranslation(language, key);

  const [role, setRole] =
    useState<Role | null>(null);

  const [permissions, setPermissions] =
    useState<Permission[]>([]);

  const [
    selectedPermissionIds,
    setSelectedPermissionIds,
  ] = useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const canUpdate =
    hasPermission("roles.update");

  useEffect(() => {
    if (!roleId) {
      return;
    }

    async function loadRole() {
      try {
        setLoading(true);
        setError(null);
        if (!roleId) {
          return;
        }
        const data =
          await getRoleDetails(
            roleId
          );

        setRole(data.role);

        setPermissions(
          data.permissions
        );

        setSelectedPermissionIds(
          data.permissions.map(
            (permission) =>
              permission.id
          )
        );
      } catch (error) {
        console.error(
          "Failed to load role:",
          error
        );

        setError(
          t("roles.details.loadError")
        );
      } finally {
        setLoading(false);
      }
    }

    loadRole();
  }, [roleId, language]);

  function togglePermission(
    permissionId: string
  ) {
    setSelectedPermissionIds(
      (current) =>
        current.includes(permissionId)
          ? current.filter(
            (id) =>
              id !== permissionId
          )
          : [
            ...current,
            permissionId,
          ]
    );
  }

  async function handleSave() {
    if (!roleId || !canUpdate) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const data =
        await updateRolePermissions(
          roleId,
          selectedPermissionIds
        );

      setRole(data.role);

      setPermissions(
        data.permissions
      );

      setSelectedPermissionIds(
        data.permissions.map(
          (permission) =>
            permission.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to update role:",
        error
      );

      setError(
        t("roles.details.saveError")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.state}>
            <LoaderCircle
              size={20}
              className={styles.spinner}
            />

            {t("roles.details.loading")}
          </div>
        </div>
      </main>
    );
  }

  if (error || !role) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.state}>
            {error ||
              t("roles.details.notFound")}

            <Button
              variant="secondary"
              onClick={() =>
                navigate("/roles")
              }
            >
              {t("common.back")}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link
          to="/roles"
          className={styles.back}
        >
          <ArrowLeft size={16} />

          {t("roles.details.back")}
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {t("roles.details.eyebrow")}
          </p>

          <div className={styles.heading}>
            <div>
              <h1 className={styles.title}>
                {role.name}
              </h1>

              <p className={styles.code}>
                {role.code}
              </p>
            </div>

            {role.is_system && (
              <span className={styles.badge}>
                {t(
                  "roles.details.system"
                )}
              </span>
            )}
          </div>

          {role.description && (
            <p className={styles.description}>
              {role.description}
            </p>
          )}
        </header>

        <section
          className={styles.permissionsSection}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <p
                className={
                  styles.sectionEyebrow
                }
              >
                {t(
                  "roles.details.permissionsEyebrow"
                )}
              </p>

              <h2>
                {t(
                  "roles.details.permissionsTitle"
                )}
              </h2>

              <p>
                {t(
                  "roles.details.permissionsDescription"
                )}
              </p>
            </div>

            <span
              className={
                styles.permissionCount
              }
            >
              {
                selectedPermissionIds.length
              }{" "}
              / {permissions.length}
            </span>
          </div>

          <div
            className={
              styles.permissionsList
            }
          >
            {permissions.map(
              (permission) => {
                const selected =
                  selectedPermissionIds.includes(
                    permission.id
                  );

                return (
                  <button
                    key={permission.id}
                    type="button"
                    disabled={!canUpdate}
                    className={
                      selected
                        ? `${styles.permission} ${styles.permissionSelected}`
                        : styles.permission
                    }
                    onClick={() =>
                      togglePermission(
                        permission.id
                      )
                    }
                  >
                    <span
                      className={
                        styles.checkbox
                      }
                    >
                      {selected && (
                        <Check
                          size={14}
                        />
                      )}
                    </span>

                    <span
                      className={
                        styles.permissionContent
                      }
                    >
                      <strong>
                        {
                          permission.name
                        }
                      </strong>

                      <code>
                        {
                          permission.code
                        }
                      </code>

                      {permission.description && (
                        <small>
                          {
                            permission.description
                          }
                        </small>
                      )}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {canUpdate && (
            <div
              className={
                styles.actions
              }
            >
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className={
                      styles.spinner
                    }
                  />
                ) : (
                  <Save size={17} />
                )}

                {saving
                  ? t(
                    "roles.details.saving"
                  )
                  : t(
                    "roles.details.save"
                  )}
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}