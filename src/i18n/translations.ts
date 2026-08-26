import type { Language } from "../types/common";
import { en } from "./en";
import { uk } from "./ua";

export const translations = {
  en,
  uk,
} satisfies Record<Language, unknown>;