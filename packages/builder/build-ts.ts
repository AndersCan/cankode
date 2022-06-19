import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

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
  const external = options.external || [];
  await build({
    platform: options.platform,
    format: options.format,
    entryPoints: input,
    outdir: outdir,
    bundle: true,
    write: true,
    plugins: options.platform === 'node' ? [nodeExternalsPlugin()] : [],
    external: external,
  });
}
