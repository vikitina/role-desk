import { translations } from "./translations";
import type { Language } from "../types/common";

type TranslationTree = typeof translations.en;

export type TranslationKey =
  | `common.${keyof TranslationTree["common"]}`
  | `navigation.${keyof TranslationTree["navigation"]}`
  | `theme.${keyof TranslationTree["theme"]}`
  | `language.${keyof TranslationTree["language"]}`
  | `home.${string}`
  | `login.${keyof TranslationTree["login"]}`
  | `register.${keyof TranslationTree["register"]}`
  | `notFound.${keyof TranslationTree["notFound"]}`
  | `footer.${keyof TranslationTree["footer"]}`;

export function getTranslation(
  language: Language,
  key: string
): string {
  const parts = key.split(".");

  let value: unknown = translations[language];

  for (const part of parts) {
    if (
      typeof value !== "object" ||
      value === null ||
      !(part in value)
    ) {
      return key;
    }

    value = (value as Record<string, unknown>)[part];
  }

  return typeof value === "string" ? value : key;
}