import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/app-layout";

import ProtectedRoute from "../components/auth/protected-route/protected-route";
import PermissionRoute from "../components/auth/permission-route/permission-route";

import HomePage from "../pages/home-page";
import LoginPage from "../pages/login-page";
import RegisterPage from "../pages/register-page";
import NotFoundPage from "../pages/not-found-page";
import DashboardPage from "../pages/dashboard-page";
import UsersPage from "../pages/users-page";
import ProfilePage from "../pages/profile-page";
import RolesPage from "../pages/roles-page";
import RoleDetailsPage from "../pages/role-details-page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/login",
        element: <LoginPage />,
      },

      {
        path: "/register",
        element: <RegisterPage />,
      },

      /*
       * PRIVATE ROUTES
       */
      {
        element: <ProtectedRoute />,

        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

          {
            path: "/profile",
            element: <ProfilePage />,
          },
          /*
           * Permission protected routes
           *
           * Позже сюда будем добавлять:
           *
           * users
           * roles
           * permissions
           */
          {
            element: (
              <PermissionRoute permission="users.read" />
            ),

            children: [
              {
                path: "/users",
                element: <UsersPage />,
              },
            ],
          },

          // {
          //   element: (
          //     <PermissionRoute permission="roles.read" />
          //   ),

          //   children: [
          //     // roles routes будут здесь
          //   ],
          // },

          {
            element: (
              <PermissionRoute permission="roles.read" />
            ),

            children: [
              {
                path: "/roles",
                element: <RolesPage />,
              },
              {
                path: "/roles/:roleId",
                element: <RoleDetailsPage />,
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);