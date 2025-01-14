const { resolve } = require("node:path");
const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
	// root: true,
	parserOptions: {
		project: true,
	},
	extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    require.resolve("@vercel/style-guide/eslint/next"),
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/react")
  ],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
	// 3/12/2024 - fixes lint issue for profile form
	// https://github.com/orgs/react-hook-form/discussions/8622#discussioncomment-4060570
	// rules: {
	// 	'@typescript-eslint/no-misused-promises': [
	// 		2,
	// 		{
	// 			checksVoidReturn: {
	// 				attributes: false,
	// 			},
	// 		},
	// 	],
	// 	'@typescript-eslint/unbound-method': 'off'
	// },

	globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  overrides: [
    { files: ["*.js?(x)", "*.ts?(x)"] },
    {
      files: ['**/app/**/{page,layout,not-found,loading,layout,error}.tsx'],
      rules: {
        'import/no-default-export': 'off',
      },
    }
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'unicorn/filename-case': 'off',
    'prefer-named-capture-group': 'off',
  },
}
