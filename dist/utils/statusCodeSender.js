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
let codes;
// pulls the statuscodejson and fills a varible with a list of codes to be used over the project
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            codes = fs_1.default.readFileSync("./src/utils/statusCodes.json", { encoding: 'utf8' });
            codes = JSON.parse(codes);
            console.log(">\u001B[36m Status Codes Loaded\u001B[0m\u001B[40m");
            if (!process.env.PORT) {
                throw new Error("DOTENV NOT SATIFIED");
            }
            else {
                console.log(">\u001B[36m DOTENV SATIFIED\u001B[0m\u001B[40m\n");
            }
        }
        catch (err) {
            if (err)
                throw err;
        }
    });
}
module.exports = {
    CodeSender: (statusCode) => {
        if (process.env.MODE === "DEV") { // Dev mode sends the description and code while in prod it only sends a code
            if (statusCode in codes) {
                return { description: codes[`${statusCode}`], statusCode };
            }
            return { statusCode };
        }
        else {
            return { statusCode };
        }
    },
    start
};
//# sourceMappingURL=statusCodeSender.js.map