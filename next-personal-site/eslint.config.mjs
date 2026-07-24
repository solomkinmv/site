import { defineConfig, globalIgnores } from 'eslint/config'
import babelParser from '@babel/eslint-parser'
import eslint from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y-x'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default defineConfig([
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11yPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooksPlugin.configs.flat.recommended.rules,
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    ...eslint.configs.recommended,
    languageOptions: {
      ...eslint.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          parserOpts: {
            plugins: ['typescript', 'jsx'],
          },
        },
      },
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])
