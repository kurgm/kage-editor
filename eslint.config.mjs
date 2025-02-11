// @ts-check

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
// @ts-ignore
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';


export default tseslint.config(
  { ignores: ['build'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
    ],

    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: true,
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': /** @type {any} */(reactHooks),
      '@stylistic': stylistic,
      import: importPlugin,
      'react-refresh': reactRefresh,
    },
    rules: {
      .../** @type {any} */(reactHooks.configs.recommended.rules),

      // http://eslint.org/docs/rules/
      'array-callback-return': 'warn',
      '@stylistic/dot-location': ['warn', 'property'],
      eqeqeq: ['warn', 'smart'],
      '@stylistic/new-parens': 'warn',
      'no-caller': 'warn',
      'no-const-assign': 'warn',
      'no-dupe-args': 'warn',
      'no-dupe-keys': 'warn',
      'no-eval': 'warn',
      'no-extend-native': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-label': 'warn',
      'no-func-assign': 'warn',
      '@typescript-eslint/no-implied-eval': 'warn',
      'no-iterator': 'warn',
      'no-label-var': 'warn',
      'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
      'no-lone-blocks': 'warn',
      '@typescript-eslint/no-loop-func': 'warn',
      '@stylistic/no-mixed-operators': [
        'warn',
        {
          groups: [
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
          allowSamePrecedence: false,
        },
      ],
      'no-multi-str': 'warn',
      'no-unsafe-negation': 'warn',
      'no-new-func': 'warn',
      'no-object-constructor': 'warn',
      'no-new-symbol': 'warn',
      'no-new-wrappers': 'warn',
      'no-obj-calls': 'warn',
      'no-octal-escape': 'warn',
      'no-restricted-syntax': ['warn', 'WithStatement'],
      'no-script-url': 'warn',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      'no-template-curly-in-string': 'warn',
      'no-this-before-super': 'warn',
      'no-throw-literal': 'warn',
      'no-unreachable': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-rename': [
        'warn',
        {
          ignoreDestructuring: false,
          ignoreImport: false,
          ignoreExport: false,
        },
      ],
      '@stylistic/no-whitespace-before-property': 'warn',
      '@stylistic/rest-spread-spacing': ['warn', 'never'],
      strict: ['warn', 'never'],
      'unicode-bom': ['warn', 'never'],
      'no-restricted-properties': [
        'error',
        {
          object: 'require',
          property: 'ensure',
          message:
            'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
        },
        {
          object: 'System',
          property: 'import',
          message:
            'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
        },
      ],
      'getter-return': 'warn',

      // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
      'import/first': 'error',
      'import/no-amd': 'error',
      'import/no-anonymous-default-export': 'warn',
      'import/no-webpack-loader-syntax': 'error',

      // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
      'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
      'react/jsx-pascal-case': [
        'warn',
        {
          allowAllCaps: true,
          ignore: [],
        },
      ],
      'react/no-typos': 'error',
      'react/style-prop-object': 'warn',

      // TODO: activate these rules
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',

      // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
      'default-case': 'off',

      // Add TypeScript specific rules (and turn off ESLint equivalents)
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/no-redeclare': 'warn',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'warn',
        {
          functions: false,
          classes: false,
          variables: false,
          typedefs: false,
        },
      ],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TODO: activate these rules
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'off',
    },
  },

  {
    files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],

    extends: [
      testingLibrary.configs['flat/react']
    ],

    plugins: {
      vitest,
    },

    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-conditional-expect': 'error',
      'vitest/no-interpolation-in-snapshots': 'error',
      'vitest/no-mocks-import': 'error',
    },
  },
);
