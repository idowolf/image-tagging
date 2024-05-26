import { exec } from 'child_process';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateTagsFromText = async (text: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../scripts/nlp.py');
        exec(`python ${scriptPath} "${text}"`, (error, stdout, _) => {
            if (error) {
                return reject(error);
            }
            try {
                const tags = JSON.parse(stdout);
                resolve(tags);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
};
