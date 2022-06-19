import gs from 'glob-stream';
import path from 'path';
import { build } from 'esbuild';
import { temporaryWrite } from 'tempy';
import { unlinkSync } from 'fs';

export async function getHtmlFile(globPattern: string | string[]) {
  const stream = gs(globPattern);
  const files = [];
  const directoryPath = path.dirname(import.meta.url.replace('file://', ''));
  const browserLoggerPath = path.resolve(directoryPath, './browser-logger.js');

  files.push(`import "${browserLoggerPath}";`);

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);
    files.push(`import "${entry.path}";`);
  }

  const entryPointContent = files.join(' ');
  const entryPointFilepath = await temporaryWrite(entryPointContent, {
    extension: 'js',
  });

  const file = await build({
    entryPoints: [entryPointFilepath],
    bundle: true,
    outdir: './not-in-use/',
    write: false,
  });
  // delete the temp file
  await unlinkSync(entryPointFilepath);

  const scriptTags = file.outputFiles
    .map((build) => {
      return `<script>${build.text}</script>`;
    })
    .join(' ');

  return htmlBlock(globPattern, scriptTags);
}
function getEntry_UNSAFE(whatever: any): gs.Entry {
  return whatever;
}

function htmlBlock(title: string | string[], scriptContent: string) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <output id="out"></output>
      </body>
      ${scriptContent}
    </html> `;
}
