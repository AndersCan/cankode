import gs from 'glob-stream';
import { build } from 'esbuild';

export async function getHtmlFile(globPattern: string | string[]) {
  const stream = gs(globPattern);
  const files = [];

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);
    files.push(entry.path);
  }

  const file = await build({
    entryPoints: files,
    bundle: true,
    outdir: './not-in-use/',
    write: false
  });
  const scriptTags = file.outputFiles
    .map(build => {
      return `<script>${build.text}</script>`;
    })
    .join(' ');

  return htmlBlock(scriptTags);
}
function getEntry_UNSAFE(whatever: any): gs.Entry {
  return whatever;
}

function htmlBlock(scriptContent: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>

  </body>
    ${scriptContent}
  </html>
  `;
}
