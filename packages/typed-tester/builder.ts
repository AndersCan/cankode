import { buildTs } from 'typed-builder';

buildTs(['./index.ts'], './build', {
  platform: 'node',
  format: 'esm'
});
