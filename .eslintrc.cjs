/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'prettier',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:tailwindcss/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    tailwindcss: {
      cssFiles: [
        '**/*.css',
        '**/*.scss',
        '!**/node_modules',
        '!**/.*',
        '!**/dist',
        '!**/build',
      ],
      config: './tailwind.config.ts',
      callees: ['classnames', 'clsx', 'ctl', 'cva', 'cx'],
    },
  },
  plugins: ['tailwindcss'],
  rules: {
    'no-console': 'warn',
    'tailwindcss/no-custom-classname': 'error',
    // https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/prefer-default-export': 'off',
    // Use function hoisting to improve code readability
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'local', varsIgnorePattern: '_' },
    ],
    // Use function hoisting to improve code readability
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],
    // Don't import devDependencies except for tests and mocks
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'codegen.ts',
          '*.config.*',
          'server/*',
          'setup-tests.js',
          'mocks/**/*',
          'app/**/*.{spec,test}.{ts,tsx}',
          'app/test/**/*',
          'test-utils/**/*',
          'app/**/*/@generated/**/*',
          './tests/**/*',
          'scripts/*',
        ],
      },
    ],
    // Promises can conflict with Error boundaries, disabled for now
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-misused-promises': 'off',

    // Valid use cases for routing and process env
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/require-prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/display-name': 'off',

    // Temporary disabled
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'react/react-in-jsx-scope': 'off',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: '*',
        prev: ['const', 'let', 'var'],
      },
      {
        blankLine: 'any',
        next: ['const', 'let', 'var'],
        prev: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
      {
        blankLine: 'never',
        next: '*',
        prev: ['case', 'default'],
      },
      {
        blankLine: 'always',
        next: '*',
        prev: ['multiline-const'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        name: '@testing-library/react',
        message: 'Please use Test utils instead ~/test-utils/utils',
      },
      {
        name: '~/lib/api/@generated/privium.schemas',
        message:
          "Don't use generated types in your view model, please use ~/lib/api/privium",
      },
      {
        name: '~/lib/api/@generated/privium',
        message:
          "Don't use api request in your view model, please use ~/lib/api/privium",
      },
    ],
  },
}
