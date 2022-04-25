module.exports = {
  '*.js': ['pnpm lint:eslint', 'pnpm lint:prettier'],
  '*.ts': ['pnpm lint:eslint', 'pnpm lint:prettier'],
  '{!(package)*.json,*.code-snippets,.*rc}': [
    'pnpm lint:prettier -- --parser json',
  ],
  'package.json': ['pnpm lint:prettier'],
}
