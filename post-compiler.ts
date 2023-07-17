import fs from 'fs';
import path from 'path';
const filesToCopy = [
    "package.json",
    "README.md",
];

(() => {
    console.info('Post Compiler: Start');
    const distPath = path.join(__dirname, 'dist');
    for (const fileToCopy of filesToCopy) {
        fs.copyFileSync(path.join(__dirname, fileToCopy), path.join(distPath, fileToCopy));
    }
    console.info('Post Compiler: End');
})();