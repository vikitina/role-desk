# RoleDesk

RoleDesk is a role-based access control (RBAC) dashboard built with React, TypeScript, Zustand and Supabase.

The project demonstrates authentication, role management, permission-based access control, protected routes and backend authorization through Supabase Edge Functions.

The main goal of the project is to demonstrate how a frontend application can implement a structured and scalable authorization system rather than relying only on UI-level access restrictions.

---

## Live Demo

**Live application:**  
https://YOUR-APP-URL.vercel.app

**Repository:**  
https://github.com/vikitina/role-desk

> The live demo URL will be added after deployment.

---

## Features

### Authentication

- User registration
- User login
- User logout
- Persistent Supabase sessions
- Authentication state management
- Protected application routes
- Automatic redirection for unauthenticated users

---

### Role-Based Access Control

RoleDesk uses a permission-based RBAC model.

Users are assigned roles, and roles receive permissions.

The authorization model is:

```text
User
  ↓
Profile
  ↓
Role
  ↓
Permissions