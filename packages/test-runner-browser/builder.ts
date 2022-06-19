import { buildTs, emitTypes } from '@cankode/builder';

buildTs(['./index.ts', './browser-logger.ts'], './build', {
  platform: 'node',
  format: 'esm',
});
emitTypes(['./index.ts'], './build');
