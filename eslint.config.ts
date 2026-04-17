import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'trash'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['vitest.config.ts', 'eslint.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      // Numbers in CSS template literals (e.g. `${size}px`, `${width}%`) are intentional
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Block props are Record<string,unknown> by design – values are intentionally cast
      '@typescript-eslint/no-base-to-string': 'off',
      // Defensive ?? and optional chaining is common with unknown props from user JSON
      '@typescript-eslint/no-unnecessary-condition': 'off',
      // String() casts on already-string values are used for clarity with unknown props
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      // Non-null assertions are used in well-understood DOM and store access patterns
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Syncing derived state from external prop changes in useEffect is a valid pattern
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  prettierConfig,
)
