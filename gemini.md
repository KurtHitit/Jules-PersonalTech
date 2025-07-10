# Gemini Agent Project Guide: My Belongings Hub

This document provides a summary of the project's architecture, conventions, and key commands to guide AI agent development.

## 1. Project Overview

- **Project Name:** My Belongings Hub
- **Architecture:** Full-stack monorepo.
- **Components:**
  - **`backend/`**: A Node.js, Express, and TypeScript REST API.
  - **`mobile/`**: A React Native and TypeScript mobile application.
  - **`docs/`**: Project documentation.
  - **`scripts/`**: Utility and automation scripts.

---

## 2. Backend (`backend/`)

The backend serves a RESTful API for the mobile application.

- **Technology Stack:**
  - **Framework:** Node.js with Express.js
  - **Language:** TypeScript
  - **Database:** MongoDB with Mongoose ODM
  - **Authentication:** JSON Web Tokens (JWT)

- **Key Directories:**
  - `src/config`: Database and JWT configuration.
  - `src/models`: Mongoose schemas (`User.ts`, `Item.ts`).
  - `src/services`: Business logic (e.g., `userService.ts`, `itemService.ts`).
  - `src/controllers`: Request/response handlers.
  - `src/routes`: API endpoint definitions.
  - `src/middleware`: Authentication middleware (`authMiddleware.ts`).
  - `src/server.ts`: Main application entry point.

- **API Conventions:**
  - All routes are prefixed with `/api`.
  - Authentication routes: `/api/auth`
  - Item routes: `/api/items` (protected by JWT middleware).

- **Important Scripts (`package.json`):**
  - `npm run dev`: Starts the server in development mode with `nodemon`.
  - `npm run build`: Compiles TypeScript to JavaScript in `dist/`.
  - `npm start`: Runs the compiled application from `dist/`.
  - `npm test`: Executes tests with Jest.

---

## 3. Mobile (`mobile/`)

The mobile app is the user-facing client for managing personal belongings.

- **Technology Stack:**
  - **Framework:** React Native
  - **Language:** TypeScript
  - **Styling:** Tailwind CSS via `nativewind`.
  - **UI Components:** `shadcn/ui` (managed via CLI).
  - **Navigation:** React Navigation.
  - **State Management:** React Context API (`AuthContext.tsx`).

- **Key Directories:**
  - `src/screens`: Top-level screen components.
  - `src/components`: Reusable components.
    - `ui/`: Reserved for `shadcn/ui` components.
  - `src/services`: API clients (`apiClient.ts`, `authService.ts`, `itemService.ts`).
  - `src/navigation`: Navigation stacks and type definitions.
  - `src/context`: Global state providers like `AuthContext`.

- **Agent Instructions & Conventions:**
  - **`shadcn/ui`:** Components must be added using the CLI (`npx shadcn-ui@latest add [component]`), not created manually. They are placed in `src/components/ui/`.
  - **API Client:** All backend communication should go through the pre-configured `axios` instance in `src/services/apiClient.ts`. It automatically attaches the JWT token to requests.
  - **API URL:** The client is configured to connect to the backend at `http://localhost:3000/api`.

- **Important Scripts (`package.json`):**
  - `npm run android`: Runs the app on an Android emulator/device.
  - `npm run ios`: Runs the app on an iOS simulator/device.
  - `npm start`: Starts the Metro bundler.
  - `npm test`: Executes tests with Jest.

---

## 4. Development Workflow

- **Task Management:** The AI agent should refer to the `tasks.md` file for the next steps and feature implementation details. When task is completed mark task as completed 

  - `npm run lint`: Lints the codebase.
