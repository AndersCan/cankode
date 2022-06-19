import { buildTs } from 'typed-builder';

buildTs(['./index.ts', './browser-logger.ts'], './build', {
  platform: 'node',
  format: 'esm',
});
