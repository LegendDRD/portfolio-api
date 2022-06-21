import fs from 'fs';
import { cLog } from './logger';
import { db } from '../db';

async function getAttachment(bookLink: string) {
    let dirLink = bookLink || null;
    if (typeof dirLink === 'undefined' || dirLink === null) {
        return false;
    }
    if (dirLink.includes('.')) {
        dirLink = bookLink.replace(".", "");

    }
    if (dirLink[dirLink.length - 1] !== '/') {
        dirLink += '/';
    }
    try {
        const files = await fs.readdirSync(`${bookLink}`);
        const contents: any[] = [];

        files.forEach((foundFile: any) => {
            const fileBuffer = fs.readFileSync(`${process.cwd()}${dirLink}${foundFile}`, { encoding: 'base64' });
            contents.push({ filename: foundFile, content: fileBuffer, encoding: 'base64' })

        });
        return contents;
    } catch (err) {
        cLog("reading signedContract", `failed due to ${err}`, 'critical');
        return false;
    }
}
async function getEmailTemplate(template: string = 'pod-template.html') {

    try {
        const fileString = fs.readFileSync(`./email_templates/${template}`,'utf8');
        const contents = fileString;
        return contents;
    } catch (err) {
        cLog("reading getEmailTemplate", `failed due to ${err}`, 'critical');
        return false;
    }
}
export = {
    getAttachment,
    getEmailTemplate
}