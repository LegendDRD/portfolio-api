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
const logger_1 = require("./logger");
const nodemailer_1 = __importDefault(require("nodemailer"));
const uploadFile_1 = __importDefault(require("./uploadFile"));
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
function emailerChecker() {
    return __awaiter(this, void 0, void 0, function* () {
        const emails = yield db_1.db.asyncPool(`SELECT * from emails WHERE status != 'sent'`, []);
        for (let i = 0; i < emails.length; i++) {
            if (emails[i].from_des === null) {
                emails[i].from_des = process.env.BCC_EMAIL;
            }
            if (emails[i].attachments !== null) {
                const base64 = yield uploadFile_1.default.getAttachment(emails[i].attachments);
                emails[i].attachments = base64;
            }
            let emailHTML = yield uploadFile_1.default.getEmailTemplate();
            if (emailHTML === false) {
                return false;
            }
            emailHTML = emailHTML.replace('{{body}}', emails[i].html);
            const mailOptions = {
                from: emails[i].from_des,
                to: emails[i].to_des,
                bcc: emails[i].bcc,
                subject: emails[i].subject,
                html: emailHTML,
                attachments: emails[i].attachments
            };
            //  attachments: emails[i].attachments
            transporter.sendMail(mailOptions, (error, info) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                    (0, logger_1.emailCLog)('Email Error: ', `Error: ${error}\n\ndata: ${JSON.stringify(emails[0])}\nmailOptions:${JSON.stringify(mailOptions)}`, false);
                    yield db_1.db.asyncPool(`UPDATE emails SET status = "failed"  WHERE id =?`, [emails[i].id]);
                }
                else {
                    // cLog('Email sent: ', info.response);
                    const result = yield db_1.db.asyncPool(`UPDATE emails SET status = "sent"  WHERE id =?`, [emails[i].id]);
                    if (result.affectedRows !== 0) {
                        (0, logger_1.emailCLog)('Email sent: ', `email response: ${JSON.stringify(info.response)}\ndata: ${JSON.stringify(emails[0])}\nmailOptions:${JSON.stringify(mailOptions)}`, false);
                    }
                }
            }));
        }
        setTimeout(() => {
            emailerChecker();
        }, 60000);
    });
}
function annualFeeChecker() {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log("runing email sender");
        const transactions = yield db_1.db.asyncPool(`SELECT * from transactions`, []);
        const books = yield db_1.db.asyncPool(`SELECT * from books`, []);
        const bookPaid = [];
        const booksNeedPayments = [];
        for (let i = 0; i < transactions.length; i++) {
            const currenttransaction = transactions[i];
            const transactionMisc = JSON.parse(currenttransaction.misc);
            const carts = transactionMisc.cart;
            if ("annualPaid" in transactionMisc) {
                if (transactionMisc.annualPaid === true) {
                    const transactionPaidDate = Date.parse(transactionMisc.paymentinfo.createdAt);
                    // console.log(transactionMisc)
                    if (Date.now() - transactionPaidDate > 31556952000) {
                        // console.log("transactionPaidDate, Date.now()");
                        for (let j = 0; j < carts.length; j++) {
                            const cart = carts[j];
                            const cartMisc = carts[j].misc;
                            // console.log('products in cart', cart)
                            if (cart.book_id !== null) {
                                booksNeedPayments.push(cart.book_id);
                            }
                        }
                    }
                    else {
                        for (let j = 0; j < carts.length; j++) {
                            const cart = carts[j];
                            const cartMisc = carts[j].misc;
                            if (cart.book_id !== null) {
                                bookPaid.push(cart.book_id);
                            }
                        }
                    }
                }
                else {
                    for (let h = 0; h < books.length; h++) {
                        let bookHasPaid = false;
                        for (let j = 0; j < bookPaid.length; j++) {
                            if (books[h].id === bookPaid[j]) {
                                bookHasPaid = true;
                            }
                        }
                        if (!bookHasPaid) {
                            const bookCreation = Date.parse(books[h].created_at);
                            if (Date.now() - bookCreation > 31556952000) {
                                booksNeedPayments.push(books[h].id);
                            }
                        }
                    }
                }
            }
        }
        for (let h = 0; h < books.length; h++) {
            let bookHasPaid = false;
            for (let j = 0; j < bookPaid.length; j++) {
                if (books[h].id === bookPaid[j]) {
                    bookHasPaid = true;
                }
            }
            if (!bookHasPaid) {
                const bookCreation = Date.parse(books[h].created_at);
                // console.log(bookCreation)
                if (Date.now() - bookCreation > 31556952000) {
                    booksNeedPayments.push(books[h].id);
                }
            }
        }
        // console.log(booksNeedPayments)
        for (let i = 0; i < booksNeedPayments.length; i++) {
            const book = yield db_1.db.asyncPool('SELECT * FROM books WHERE id =?', [booksNeedPayments[i]]);
            const productMisc = yield db_1.db.asyncPool(`SELECT * FROM products WHERE name = "Annual Market Access Fee"`, []);
            if (productMisc.length < 1) {
                (0, logger_1.cLog)("maintenace failed for annualFeeChecker", 'productMisc found no Annual Market Access Fee');
            }
            const annualInCart = yield db_1.db.asyncPool(`SELECT * FROM carts WHERE user_id =? AND book_id =?`, [book[0].user_id, book[0].id]);
            let annualCart = false;
            for (let j = 0; j < annualInCart.length; j++) {
                const cartMiscTemp = JSON.parse(annualInCart[j].misc);
                if (cartMiscTemp[0].name === 'Annual Market Access Fee') {
                    annualCart = true;
                }
            }
            if (!annualCart) {
                yield db_1.db.asyncPool(`UPDATE users SET is_activated =? WHERE id=?`, [2, book[0].user_id]);
                const results = yield db_1.db.asyncPool(`INSERT INTO carts (user_id,misc,book_id) VALUES(?,?,?)`, [book[0].user_id, JSON.stringify(productMisc), book[0].id]);
                if (results.affectedRows !== 1) {
                    (0, logger_1.cLog)("maintenace failed for annualFeeChecker", 'failed to update user');
                }
                // console.log("Added to cart for user",book[0].user_id)
            }
        }
        console.log("Annual Check done");
        setTimeout(() => {
            annualFeeChecker();
        }, 43200000);
    });
}
module.exports = {
    emailerChecker,
    annualFeeChecker
};
//# sourceMappingURL=maintenance.js.map