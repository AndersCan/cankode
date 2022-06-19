import { buildTs, emitTypes } from '@cankode/builder';

buildTs(['./src/index.ts'], './build', {
  platform: 'node',
  format: 'esm',
});
emitTypes(['./src/index.ts'], './build');
