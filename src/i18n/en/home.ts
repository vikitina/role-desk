export const home = {
      eyebrow: "DEMONSTRATION APPLICATION",

      title: "A role-based application built for real-world access control.",

      description:
        "This project demonstrates authentication, role-based permissions, protected routes, CRUD operations and secure backend access.",

      primaryAction: "Explore the application",
      secondaryAction: "View demo access",

      featuresTitle: "What this application demonstrates",

      features: {
        authentication: {
          title: "Authentication",
          description:
            "Registration, login, logout and persistent sessions.",
        },

        authorization: {
          title: "Role-based access",
          description:
            "Different users see and can perform different operations.",
        },

        permissions: {
          title: "Fine-grained permissions",
          description:
            "Permissions can be assigned to roles and managed by administrators.",
        },

        security: {
          title: "Backend security",
          description:
            "Access is protected on the backend, not only hidden in the interface.",
        },

        crud: {
          title: "CRUD operations",
          description:
            "Create, read, update and delete operations with permission checks.",
        },

        architecture: {
          title: "Extensible architecture",
          description:
            "The system is designed to make adding roles, permissions and features predictable.",
        },
      },

      rolesTitle: "Demo roles",

      rolesDescription:
        "Each role provides a different level of access to the application.",

      roles: {
        administrator: {
          name: "Administrator",
          description:
            "Full access. Can manage users, roles, permissions and application data.",
        },

        manager: {
          name: "Manager",
          description:
            "Can manage operational data but has limited access to system administration.",
        },

        viewer: {
          name: "Viewer",
          description:
            "Read-only access to the application.",
        },
      },

      invitationTitle: "Ready to explore?",

      invitationDescription:
        "Create an account or use one of the demonstration users to explore the application.",

      demoTitle: "Demo access",

      demoAdministrator: "Administrator",
      demoManager: "Manager",
      demoViewer: "Viewer",

      demoCredentials:
        "Demo credentials will be available on the login page.",
    }