module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'lib/**', label: 'Library' },
          { path: 'examples/**', label: 'Examples' },
          { path: 'flow-typed/**', label: 'Flow Typed' },
          { path: 'schema/**', label: 'Molotov Schema' },
          { path: '_errors.js', label: 'Errors' },
          { path: 'yarn.lock', label: 'Yarn Lock' },
          { path: 'README.md', label: 'Read Me' },
          { path: 'package.json', label: 'Examples' },
          { path: 'LICENSE', label: 'License' },
          { path: 'index.js', label: 'Index' },
        ],
      },
    ],
  ],
};
