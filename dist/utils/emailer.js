"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
// host: "smtp.office365.com",
// port: 587,
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.bemail.online",
    port: 587,
    auth: {
        user: process.env.NODE_MAILER_EMAIL_ADDRESS,
        pass: process.env.NODE_MAILER_EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});
function logEmail(data) {
    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL_ADDRESS,
        to: process.env.BCC_EMAIL,
        subject: "Current Logger",
        text: data
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.log(error);
            (0, logger_1.cLog)('Email sent: ', error, 'criticle');
        }
        else {
            (0, logger_1.cLog)('Email sent: ', info.response, 'debug', false);
        }
    });
}
exports.logEmail = logEmail;
//# sourceMappingURL=emailer.js.map