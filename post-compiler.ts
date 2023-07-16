import fs from 'fs';
import path from 'path';

(() => {
    console.info('Post Compiler: Start');
    const distPath = path.join(__dirname, 'dist');
    fs.copyFileSync(path.join(__dirname, 'package.json'), path.join(distPath, 'package.json'));
    fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(distPath, 'README.md'));
    console.info('Post Compiler: End');
})();