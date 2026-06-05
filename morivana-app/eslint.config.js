import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist',
      'vite.config.js',
      'eslint.config.js',
      'scripts/**',
      'server/**',
      'public/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020
      }
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'no-unused-vars': 'off',
      'react-refresh/only-export-components': 'off' // Turn off to prevent build failures from fast-refresh warnings
    },
    settings: {
      react: {
        version: '19.2'
      }
    }
  }
]
