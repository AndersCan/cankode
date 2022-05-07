import { buildTs } from 'typed-builder';

buildTs(['./src/index.ts'], './build', {
  platform: 'node',
  format: 'esm'
});
