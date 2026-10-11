import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      'babel.config.js',
      'jest.config.js',
      'vue.config.js',
      'vite.config.js'
    ]
  },
  {
    files: ['**/*.{js,vue}'],
    plugins: {
      prettier: pluginPrettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        es2024: true,
        process: 'readonly'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/require-prop-types': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/require-default-prop': 'off',
      // Disable vue rules that conflict with prettier
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['tests/**/*.spec.js', 'tests/setup.js'],
    languageOptions: {
      globals: {
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    }
  },
  {
    files: ['src/utils/logger.js'],
    rules: {
      'no-console': 'off'
    }
  }
]