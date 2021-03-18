module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'generator-star-spacing': 'off',
    'comma-style': [
      'warn',
      'first'
    ],
    'space-in-parens': 0,
    'space-before-blocks': 0,
    'padded-blocks': 0,
    'space-before-function-paren': 0,
    'no-unused-vars': 'warn'
  }
}
