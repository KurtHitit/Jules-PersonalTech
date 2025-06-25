# AGENTS.md - My Belongings Hub

This file provides general guidelines for AI agents working on the "My Belongings Hub" project.

## General Principles
1.  **Understand the Business Plan:** Familiarize yourself with the overall business plan to understand the project's goals and features. The plan is extensive and provides context for development decisions.
2.  **MVP Focus:** Initially, prioritize features outlined in Phase 1 (MVP) of the product roadmap.
3.  **Technology Stack:**
    *   **Backend:** Node.js, TypeScript
    *   **Mobile:** React Native, TypeScript
    *   **Styling (Mobile):** Tailwind CSS
    *   **UI Components (Mobile):** shadcn/ui (added via CLI as needed)
4.  **Code Quality:**
    *   Write clean, maintainable, and well-documented code.
    *   Follow standard coding conventions for TypeScript, Node.js, and React Native.
    *   Include comments where necessary to explain complex logic.
5.  **Testing:**
    *   Aim for good test coverage.
    *   Backend: Unit and integration tests.
    *   Mobile: Component and screen tests.
6.  **Directory Structure:** Adhere to the established directory structure. If new directories are needed, discuss their purpose.
7.  **Communication:** If requirements are unclear or if a significant deviation from the plan is needed, ask for clarification.

## Backend Specifics
-   Use `src/server.ts` (or `src/index.ts`) as the main entry point.
-   Follow RESTful principles for API design.
-   Implement proper error handling.

## Mobile Specifics
-   `App.tsx` is the main entry point for the mobile application.
-   Organize components, screens, and services logically within the `src/` directory.
-   For `shadcn/ui` components:
    *   These are typically added via a CLI command (e.g., `npx shadcn-ui@latest add [component-name]`).
    *   They are expected to be placed in `src/components/ui/`.
    *   Do not manually create these component files; assume the CLI will be used by a developer or simulate this if possible.
-   Tailwind CSS is configured via `tailwind.config.js`.

## Workflow
1.  **Plan:** Always create or update a plan before making significant changes.
2.  **Implement:** Write code according to the plan.
3.  **Test:** Write and run tests for new features or bug fixes.
4.  **Review:** (Simulated) Ensure changes meet project standards.
5.  **Submit:** Commit changes with clear, descriptive messages.

This document may be updated as the project evolves.
