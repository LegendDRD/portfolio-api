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
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
module.exports = {
    user: (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            return res.sendStatus(401);
        try {
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    console.log(err, "verify");
                    return res.sendStatus(403);
                }
                req.user = user;
                // console.log(req.user);
                next();
            });
        }
        catch (err) {
            return res.sendStatus(403).send('Token Error');
        }
    },
    admin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null)
            return res.sendStatus(401);
        try {
            jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(err, "verify");
                    return res.sendStatus(403);
                }
                req.user = user;
                const result = yield db_1.db.asyncPool(`SELECT * FROM roles WHERE name = 'admin' OR name = 'superadmin'`, []);
                // console.log(result)
                if (result.length < 1) {
                    return res.sendStatus(404);
                }
                let found = false;
                for (let i = 0; i < result.length; i++) {
                    if (req.user.role_id === result[i].id) {
                        found = true;
                    }
                }
                if (found) {
                    next();
                }
                else {
                    return res.sendStatus(401);
                }
            }));
        }
        catch (err) {
            return res.sendStatus(403).send('Token Error');
        }
    })
};
//# sourceMappingURL=verify.js.map