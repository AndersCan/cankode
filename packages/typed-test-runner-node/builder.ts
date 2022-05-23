import { buildTs } from 'typed-builder';

buildTs(['./index.ts'], './build', {
  platform: 'node',
  format: 'esm',
  external: ['glob-stream'],
});

buildTs(['./worker.ts'], './build', {
  platform: 'node',
  format: 'esm',
});
