import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { join } from 'path';
import baseTsConfig from '../../tsconfig.base.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: __dirname,
  build: {
    outDir: '../../dist/packages/plugin-ui',
    emptyOutDir: true,
  },
  resolve: {
    alias: Object.entries(baseTsConfig.compilerOptions.paths).reduce(
      (acc, [key, paths]) => ({
        ...acc,
        [key]: (paths as string[]).map((path) => join(appRootPath, path)),
      }),
      {}
    ),
  },
});
