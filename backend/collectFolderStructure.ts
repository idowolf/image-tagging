// Script to print out the folder structure inside src/
import fs from 'fs';
import path from 'path';

// define __dirname
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

const rootDir = path.join(__dirname, '../src');

function collectFolderStructure(dir, fileList) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // trim everything before including 'src/'
            fileList.push(filePath.substring(filePath.indexOf('src/') + 4));
            collectFolderStructure(filePath, fileList);
        } else {
            fileList.push(filePath.substring(filePath.indexOf('src/') + 4));
        }
    }
    );
    return fileList;
}

const folderStructure = collectFolderStructure(rootDir, []);
console.log(folderStructure);