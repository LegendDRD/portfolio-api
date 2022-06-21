import { db } from '../db';
import { cLog, emailCLog } from './logger';
import delay from 'delay';
import nodemailer from 'nodemailer';
import uploadFile from './uploadFile';

const transporter = nodemailer.createTransport({
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
async function emailerChecker() {

    const emails = await db.asyncPool(`SELECT * from emails WHERE status != 'sent'`, []);

    for (let i = 0; i < emails.length; i++) {
        if (emails[i].from_des === null) { emails[i].from_des = process.env.BCC_EMAIL }

        if (emails[i].attachments !== null) {
            const base64 = await uploadFile.getAttachment(emails[i].attachments)
            emails[i].attachments = base64;
        }

        let emailHTML = await uploadFile.getEmailTemplate();
        if (emailHTML === false) {
            return false;
        }
        emailHTML = emailHTML.replace('{{body}}', emails[i].html)

        const mailOptions = {
            from: emails[i].from_des,
            to: emails[i].to_des,
            bcc: emails[i].bcc,
            subject: emails[i].subject,
            html: emailHTML,
            attachments: emails[i].attachments
        };
        //  attachments: emails[i].attachments
        transporter.sendMail(mailOptions, async (error: any, info: any) => {
            if (error) {
                console.log(error);
                emailCLog('Email Error: ', `Error: ${error}\n\ndata: ${JSON.stringify(emails[0])}\nmailOptions:${JSON.stringify(mailOptions)}`, false);
                await db.asyncPool(`UPDATE emails SET status = "failed"  WHERE id =?`, [emails[i].id]);
            } else {
                // cLog('Email sent: ', info.response);
                const result = await db.asyncPool(`UPDATE emails SET status = "sent"  WHERE id =?`, [emails[i].id]);
                if (result.affectedRows !== 0) {
                    emailCLog('Email sent: ', `email response: ${JSON.stringify(info.response)}\ndata: ${JSON.stringify(emails[0])}\nmailOptions:${JSON.stringify(mailOptions)}`, false);
                }
            }
        });
    }

    setTimeout(() => {
        emailerChecker();
    }, 60000);
}
async function annualFeeChecker() {
    // console.log("runing email sender");
    const transactions = await db.asyncPool(`SELECT * from transactions`, []);
    const books = await db.asyncPool(`SELECT * from books`, []);

    const bookPaid: any = [];
    const booksNeedPayments: any = []
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

                } else {

                    for (let j = 0; j < carts.length; j++) {
                        const cart = carts[j];
                        const cartMisc = carts[j].misc;
                        if (cart.book_id !== null) {
                            bookPaid.push(cart.book_id);
                        }
                    }

                }

            } else {

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

        const book = await db.asyncPool('SELECT * FROM books WHERE id =?', [booksNeedPayments[i]]);
        const productMisc = await db.asyncPool(`SELECT * FROM products WHERE name = "Annual Market Access Fee"`, []);

        if (productMisc.length < 1) { cLog("maintenace failed for annualFeeChecker", 'productMisc found no Annual Market Access Fee') }

        const annualInCart = await db.asyncPool(`SELECT * FROM carts WHERE user_id =? AND book_id =?`, [book[0].user_id, book[0].id]);
        let annualCart = false;
        for (let j = 0; j < annualInCart.length; j++) {

            const cartMiscTemp = JSON.parse(annualInCart[j].misc);
            if (cartMiscTemp[0].name === 'Annual Market Access Fee') { annualCart = true; }

        }
        if (!annualCart) {

            await db.asyncPool(`UPDATE users SET is_activated =? WHERE id=?`, [2, book[0].user_id]);
            const results = await db.asyncPool(`INSERT INTO carts (user_id,misc,book_id) VALUES(?,?,?)`, [book[0].user_id, JSON.stringify(productMisc), book[0].id]);

            if (results.affectedRows !== 1) {

                cLog("maintenace failed for annualFeeChecker", 'failed to update user')
            }
           // console.log("Added to cart for user",book[0].user_id)
        }
    }

    console.log("Annual Check done")
    setTimeout(() => {
        annualFeeChecker();
    }, 43200000);
}



export = {

    emailerChecker,
    annualFeeChecker
}
