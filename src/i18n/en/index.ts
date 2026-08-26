import { common } from "./common";
import { dashboard } from "./dashboard";
import { home } from "./home";
import { navigation } from "./navigation";
import { profile } from "./profile";
import { roles } from "./roles";
import { users } from "./users";

export const en = {
    common,

    navigation,
    roles,

    theme: {
      light: "Light theme",
      dark: "Dark theme",
    },

    language: {
      english: "English",
      ukrainian: "Українська",
    },

    home,
    profile,

    login: {
      eyebrow: "AUTHENTICATION",
      title: "Sign in",
      description:
        "Use your account or one of the demonstration accounts to enter the application.",

      email: "Email",
      password: "Password",

      submit: "Sign in",

      noAccount: "Don't have an account?",
      createAccount: "Create one",
    },

    register: {
      eyebrow: "NEW ACCOUNT",
      title: "Create an account",
      description:
        "Create a demo account and explore the role-based application.",

      name: "Name",
      email: "Email",
      password: "Password",

      submit: "Create account",

      haveAccount: "Already have an account?",
      login: "Sign in",
    },

    notFound: {
      eyebrow: "404",
      title: "Page not found",
      description:
        "The page you are looking for does not exist or has been moved.",
    },

    footer: {
      text: "RoleDesk — demonstration application",
    },

    users,
    dashboard,
  }