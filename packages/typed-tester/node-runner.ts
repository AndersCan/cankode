import gs from 'glob-stream';
import { build } from 'esbuild';

export async function runTests(globPattern: string | string[]) {
  const stream = gs(globPattern);

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);

    const path = entry.path;
    // TODO: Emit test file has been found and let someone else run it
    import(path);
  }
}

export async function getHtmlFile(globPattern: string | string[]) {
  const stream = gs(globPattern);
  const files = [];
  // const scripts = [];
  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);
    // const localPath = entry.path.replace(entry.base, '');
    // const scriptTag = `<script src="${localPath}"> </script>`;

    files.push(entry.path);
    // scripts.push(scriptTag);
  }
  // console.log(scripts);

  const file = await build({
    entryPoints: files,
    bundle: true,
    outdir: './not-in-use/',
    write: false
  });
  const out = file.outputFiles;
  console.log(out.length, 'should be 1');
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
