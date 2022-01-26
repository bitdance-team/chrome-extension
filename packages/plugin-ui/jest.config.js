module.exports = {
  displayName: 'plugin-ui',
  preset: '../../jest.preset.js',
  transform: {
    '^.+.vue$': 'vue3-jest',
    '.+.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'vue', 'js', 'json'],
  coverageDirectory: '../../coverage/packages/plugin-ui',
  snapshotSerializers: ['jest-serializer-vue'],
  globals: {
    'ts-jest': {
      tsconfig: 'packages/plugin-ui/tsconfig.spec.json',
    },
    'vue-jest': {
      tsConfig: 'packages/plugin-ui/tsconfig.spec.json',
    },
  },
};
