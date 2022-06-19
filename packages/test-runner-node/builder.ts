import { buildTs, emitTypes } from '@cankode/builder';

buildTs(['./index.ts'], './build', {
  platform: 'node',
  format: 'esm',
  external: ['glob-stream'],
});

buildTs(['./worker.ts'], './build', {
  platform: 'node',
  format: 'esm',
});

emitTypes(['./index.ts'], './build');
