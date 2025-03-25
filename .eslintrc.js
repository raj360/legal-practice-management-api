module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  overrides: [
    {
      // Disable require-await rule specifically for the PrismaService file
      files: ['src/prisma/prisma.service.ts'],
      rules: {
        '@typescript-eslint/require-await': 'off'
      }
    }
  ]
}; 