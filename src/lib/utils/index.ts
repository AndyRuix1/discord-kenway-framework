import fs from 'fs';
import { join as pathJoin, extname } from 'path';

export const getFiles = (dir: string, fileExtensions: string[]): string[] => {
    const files: string[] = [];
    const fileNames = fs.readdirSync(dir);
    for (const fileName of fileNames) {
        const filePath = pathJoin(dir, fileName);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            const fileExtension = extname(filePath);
            if (fileExtensions.includes(fileExtension)) files.push(filePath);
        } else if (stat.isDirectory()) {
            const subfolderFiles = getFiles(filePath, fileExtensions);
            files.push(...subfolderFiles);
        }
    }
    return files;
}

export const stringPropertyAreValid = (text: any): text is string => {
    if (typeof text !== 'string') return false;
    if (text.length === 0) return false;
    return true;
}

export const getRandomArrayUniqueElement = (array: any[], previousElement: any, key: any): { element: any, position: number } => {
    const filteredArray = array.filter((obj) => obj[key] !== previousElement[key]);
    const randomPosition = Math.floor(Math.random() * filteredArray.length);
    return {
        element: filteredArray[randomPosition],
        position: randomPosition
    };
}

export const getNextArrayElement = (array: any[], actualPosition: number): { element: any, newPosition: number } => {
    const arrayElement = array[actualPosition + 1];
        return {
            element: arrayElement ?? array[0],
            newPosition: arrayElement ? actualPosition + 1 : 0
        };
}


export { validateCommandOptions, isInstanceOfTCommandOptions } from './Command.util';