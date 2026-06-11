// ============================================
// HMITLC LMS - ESLint Configuration
// ============================================

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // React rules
    'react/prop-types': 'off', // Disable prop-types for now
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unescaped-entities': 'off',

    // Import rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'off',

    // Prettier
    'prettier/prettier': 'error',

    // Best practices
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',

    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
  },
  overrides: [
    {
      files: ['*.test.js', '*.test.jsx', '*.spec.js', '*.spec.jsx'],
      env: {
        jest: true,
      },
    },
    {
      files: ['backend/**/*.js'],
      env: {
        node: true,
        es2021: true,
      },
      extends: ['eslint:recommended'],
    },
  ],
};