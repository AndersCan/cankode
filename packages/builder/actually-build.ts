import { buildTs } from './build-ts';

main();
async function main() {
  await buildTs(['./index.ts'], './build/', {
    format: 'esm',
    platform: 'node',
    external: ['esbuild']
  });
}
