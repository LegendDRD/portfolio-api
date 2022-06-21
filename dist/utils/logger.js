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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailCLog = exports.auditLog = exports.cLog = void 0;
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../db");
const emailer_js_1 = require("./emailer.js");
// log function to replace console log as well being able to be configered in the env to email and write logs to the database
function cLog(src, info, errorLevel = "debug", cLogTrue = true) {
    // console.log("ending");
    const writeFileLevel = process.env.FILE_LEVEL || "critical";
    const writeToDb = process.env.CLOG_DB || "critical";
    const sendEmail = process.env.EMAIL_LEVEL || "critical";
    const logData = ` \nErrorLevel: ${errorLevel} \n\tSource: ${src} \n\tINFO: ${info}`;
    if (cLogTrue) {
        console.log(logData);
    }
    switch (writeFileLevel) {
        case "debug":
            writeToFile(src, info, errorLevel);
            if (writeToDb === 'true') {
                writeToDB(src, info, errorLevel);
            }
            break;
        case "warning":
            if (errorLevel !== "debug") {
                writeToFile(src, info, errorLevel);
                if (writeToDb === 'true') {
                    writeToDB(src, info, errorLevel);
                }
            }
            break;
        case "error":
            if (errorLevel !== "debug" && errorLevel !== "warning") {
                writeToFile(src, info, errorLevel);
                if (writeToDb === 'true') {
                    writeToDB(src, info, errorLevel);
                }
            }
            break;
        case "critical":
            if (errorLevel === "critical") {
                writeToFile(src, info, errorLevel);
                if (writeToDb === 'true') {
                    writeToDB(src, info, errorLevel);
                }
            }
            break;
    }
    switch (sendEmail) {
        case "debug":
            (0, emailer_js_1.logEmail)(logData);
            break;
        case "warning":
            if (errorLevel !== "debug") {
                (0, emailer_js_1.logEmail)(logData);
            }
            break;
        case "error":
            if (errorLevel !== "debug" && errorLevel !== "warning") {
                (0, emailer_js_1.logEmail)(logData);
            }
            break;
        case "critical":
            if (errorLevel === "critical") {
                (0, emailer_js_1.logEmail)(logData);
            }
            break;
    }
}
exports.cLog = cLog;
function auditLog(userId, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.asyncPool(`SELECT * from users where id=?`, [userId]);
        const results = yield db_1.db.asyncPool(`INSERT INTO audit (from_user, user_id, action) VALUES ('${user[0].name_first} ${user[0].name_last}','${userId}', '${action}')`, []);
    });
}
exports.auditLog = auditLog;
function emailCLog(src, info, cLogTrue = false) {
    let currentDate = new Date(Date.now());
    currentDate = `${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}`;
    const logData = ` \nEmailLOG Time: ${currentDate} \n\tSource: ${src} \n\tINFO: ${info}`;
    if (cLogTrue) {
        console.log(logData);
    }
    writeToEmailFile(logData);
}
exports.emailCLog = emailCLog;
function writeToFile(src, info, errorLevel = "debug") {
    if (!fs_1.default.existsSync(`./logs`)) {
        fs_1.default.mkdirSync(`./logs`);
    }
    const logData = `ErrorLevel: ${errorLevel} \n\tSource: ${src} \n\t INFO: ${info} \n\n`;
    fs_1.default.appendFile("./logs/errorlogs.txt", logData, (err) => {
        if (err) {
            return console.log(err);
        }
    });
}
function writeToEmailFile(logData) {
    if (!fs_1.default.existsSync(`./logs`)) {
        fs_1.default.mkdirSync(`./logs`);
    }
    // const logData = `ErrorLevel: ${errorLevel} \n\tSource: ${src} \n\t INFO: ${info} \n\n`;
    fs_1.default.appendFile("./logs/emaillogs.txt", logData, (err) => {
        if (err) {
            return console.log(err);
        }
    });
}
function writeToDB(src, info, errorLevel = "debug") {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield db_1.db.asyncPool(`INSERT INTO logs (src, info, error_level) VALUES ('${src}', '${info}', '${errorLevel}')`, []);
        console.log(results);
    });
}
//# sourceMappingURL=logger.js.map