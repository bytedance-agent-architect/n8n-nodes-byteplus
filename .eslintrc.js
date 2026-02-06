module.exports = {
	root: true,
	env: {
		node: true,
		es2022: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:n8n-nodes-base/nodes',
		'plugin:n8n-nodes-base/credentials',
		'plugin:n8n-nodes-base/community',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['n8n-nodes-base'],
	rules: {
		'no-unused-vars': ['error', { argsIgnorePattern: '^_', args: 'none' }],
		'prefer-const': 'error',
		'no-var': 'error',
		// Community packages should use HTTP URLs for documentation; camel-case rule applies to core only.
		'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
	},
	ignorePatterns: ['dist/', 'node_modules/', '*.js'],
};
