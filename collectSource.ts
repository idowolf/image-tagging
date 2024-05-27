import { join } from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = join(__dirname, 'src');

/**
 * Strips comments and documentation from TypeScript source code.
 * @param {string} content - The content of the source code file.
 * @returns {string} - The source code without comments and documentation.
 */
function stripComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
}

async function collectSource(dir: string): Promise<string> {
  const files = await fs.readdir(dir);
  let output = '';

  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await fs.stat(filePath);
    const filePrinted = filePath.substring(filePath.indexOf('src/') + 4);
    if (fileStat.isDirectory()) {
      output += await collectSource(filePath);
    } else if (file.endsWith('.ts')) {
      const content = await fs.readFile(filePath, 'utf-8');
      const strippedContent = stripComments(content);
      output += `\n\n/* ${filePrinted} */\n${strippedContent}`;
    }
  }

  return output;
}

collectSource(srcDir)
  .then((result) => {
    fs.writeFile(join(__dirname, 'output.txt'), result);
  })
  .catch((error) => {
    console.error('Error collecting source files:', error);
  });
