import { execSync } from 'child_process';

export function emitTypes(files: string[], outdir: string) {
  for (const file of files) {
    execSync(
      `pnpm tsc ${file} --outDir ${outdir} --declaration --emitDeclarationOnly --skipLibCheck --target ESNext --module ESNext --moduleResolution Node --allowSyntheticDefaultImports`
    );
  }
}
