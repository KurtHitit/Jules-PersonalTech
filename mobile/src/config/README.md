# Configuration

This directory is for configuration files specific to the mobile application.

Examples:
- `apiConfig.ts`: Base URL for the API, API keys (use environment variables for sensitive data).
- `theme.ts`: Theme colors, fonts, spacing definitions (if not fully managed by Tailwind).
- `featureFlags.ts`: Configuration for feature flags.
- `env.ts` (or similar, often integrated with `react-native-dotenv`): To manage environment-specific variables.

**Note on Environment Variables:**
For managing different environments (development, staging, production), consider using a library like `react-native-dotenv` to load variables from `.env` files. Ensure `.env` files containing sensitive information are added to `.gitignore`.
