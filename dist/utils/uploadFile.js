"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./logger");
function getAttachment(bookLink) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const files = yield fs_1.default.readdirSync(`${bookLink}`);
            const contents = [];
            files.forEach((foundFile) => {
                const fileBuffer = fs_1.default.readFileSync(`${process.cwd()}${dirLink}${foundFile}`, { encoding: 'base64' });
                contents.push({ filename: foundFile, content: fileBuffer, encoding: 'base64' });
            });
            return contents;
        }
        catch (err) {
            (0, logger_1.cLog)("reading signedContract", `failed due to ${err}`, 'critical');
            return false;
        }
    });
}
function getEmailTemplate(template = 'pod-template.html') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileString = fs_1.default.readFileSync(`./email_templates/${template}`, 'utf8');
            const contents = fileString;
            return contents;
        }
        catch (err) {
            (0, logger_1.cLog)("reading getEmailTemplate", `failed due to ${err}`, 'critical');
            return false;
        }
    });
}
module.exports = {
    getAttachment,
    getEmailTemplate
};
//# sourceMappingURL=uploadFile.js.map