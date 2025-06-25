# UI (shadcn/ui)

This directory is reserved for UI components added and managed by `shadcn/ui`.

**Important:**
-   Do **not** manually create or modify files directly in this directory unless you are an expert in how `shadcn/ui` structures its components.
-   To add new components from `shadcn/ui`, use the official CLI command:
    `npx shadcn-ui@latest add [component-name]`
    (e.g., `npx shadcn-ui@latest add button`, `npx shadcn-ui@latest add card`)
-   Refer to the `shadcn/ui` documentation for available components and usage.

This approach ensures that components are correctly scaffolded with all their dependencies and styles, and are compatible with the `shadcn/ui` ecosystem. You will typically import these components from `@/components/ui/[component-name]` in your screens and other components.
