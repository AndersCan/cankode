import { build } from 'esbuild';

interface BuildOptions {
  format: 'esm' | 'iife';
  platform: 'browser' | 'node';
  external?: string[];
}

export async function buildTs(
  input: string[],
  outdir: string,
  options: BuildOptions
) {
  await build({
    platform: options.platform,
    format: options.format,
    entryPoints: input,
    outdir: outdir,
    bundle: true,
    write: true,
    external: options.external
  });
}
