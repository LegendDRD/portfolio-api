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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_js_1 = require("./logger.js");
module.exports = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            return resolve(false);
        try {
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    (0, logger_js_1.cLog)("jsonDecoder script", `verify failed ${err}`, 'criticle');
                    return resolve(false);
                }
                req.user = user;
                (0, logger_js_1.cLog)("jsonDecoder script", `verify  ${JSON.stringify(user)}`, 'debug', false);
                return resolve(user);
            });
        }
        catch (err) {
            (0, logger_js_1.cLog)("jsonDecoder script", `verify failed ${err}`, 'warning');
            return resolve(false);
        }
    }));
});
//# sourceMappingURL=jsonDecoder.js.map