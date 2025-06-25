# Mobile

This directory contains the React Native mobile application code for My Belongings Hub.
It is built using React Native and TypeScript.

Key subdirectories:
- `src/`: Contains the main source code.
  - `assets/`: Static assets like images and fonts.
  - `components/`: Reusable UI components.
    - `ui/`: Intended for `shadcn/ui` components (which will be added via CLI).
  - `config/`: Configuration files for the mobile app.
  - `hooks/`: Custom React hooks.
  - `navigation/`: Navigation setup (e.g., React Navigation).
  - `screens/`: Top-level screen components.
  - `services/`: API clients and other services.
  - `styles/`: Global styles and theme information (Tailwind CSS will be configured).
  - `utils/`: Utility functions.

**UI Libraries:**
- **Tailwind CSS:** Used for styling. Configuration is in `tailwind.config.js`.
- **shadcn/ui:** Components will be added to `src/components/ui/` as needed using the `shadcn-ui` CLI. Refer to shadcn/ui documentation for adding components.
