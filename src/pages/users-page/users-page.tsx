import { useEffect, useState } from "react";
import { Plus, UserRound } from "lucide-react";

import { useLanguageStore } from "../../stores/language.store";
import { useAuthStore } from "../../stores/auth.store";

import { getTranslation } from "../../i18n";

import { getUsers } from "../../services/user.service";

import type { User } from "../../types/user";

import Button from "../../components/ui/button";
import CreateUserModal from "../../components/users/create-user-modal/create-user-modal";

import styles from "./users-page.module.scss";

export default function UsersPage() {
  const language = useLanguageStore(
    (state) => state.language
  );

  const canCreate = useAuthStore(
    (state) =>
      state.hasPermission("users.create")
  );

  const t = (key: string) =>
    getTranslation(language, key);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error
      );

      setError(
        t("users.loadError")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [language]);

  function handleUserCreated(
    user: User
  ) {
    setUsers((currentUsers) => [
      user,
      ...currentUsers,
    ]);

    setIsCreateOpen(false);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              {t("users.eyebrow")}
            </p>

            <h1 className={styles.title}>
              {t("users.title")}
            </h1>

            <p className={styles.description}>
              {t("users.description")}
            </p>
          </div>

          {canCreate && (
            <Button
              type="button"
              onClick={() =>
                setIsCreateOpen(true)
              }
            >
              <Plus size={17} />

              {t("users.create.button")}
            </Button>
          )}
        </header>

        <section className={styles.content}>
          {loading && (
            <div className={styles.state}>
              {t("users.loading")}
            </div>
          )}

          {!loading && error && (
            <div className={styles.state}>
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            users.length === 0 && (
              <div className={styles.state}>
                {t("users.empty")}
              </div>
            )}

          {!loading &&
            !error &&
            users.length > 0 && (
              <div className={styles.table}>
                <div
                  className={
                    styles.tableHeader
                  }
                >
                  <span>
                    {t(
                      "users.columns.user"
                    )}
                  </span>

                  <span>
                    {t(
                      "users.columns.role"
                    )}
                  </span>

                  <span>
                    {t(
                      "users.columns.created"
                    )}
                  </span>
                </div>

                {users.map((user) => (
                  <div
                    className={
                      styles.tableRow
                    }
                    key={user.id}
                  >
                    <div
                      className={
                        styles.user
                      }
                    >
                      <div
                        className={
                          styles.avatar
                        }
                      >
                        <UserRound
                          size={16}
                        />
                      </div>

                      <div>
                        <strong>
                          {
                            user.display_name
                          }
                        </strong>

                        <span>
                          {user.id}
                        </span>
                      </div>
                    </div>

                    <div
                      className={
                        styles.role
                      }
                    >
                      <span
                        className={
                          styles.roleCode
                        }
                      >
                        {
                          user.role
                            .code
                        }
                      </span>

                      <span
                        className={
                          styles.roleName
                        }
                      >
                        {
                          user.role
                            .name
                        }
                      </span>
                    </div>

                    <time
                      className={
                        styles.date
                      }
                      dateTime={
                        user.created_at
                      }
                    >
                      {new Date(
                        user.created_at
                      ).toLocaleDateString(
                        language ===
                          "uk"
                          ? "uk-UA"
                          : "en-US"
                      )}
                    </time>
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>

      {isCreateOpen && (
        <CreateUserModal
          onClose={() =>
            setIsCreateOpen(false)
          }
          onCreated={
            handleUserCreated
          }
        />
      )}
    </main>
  );
}