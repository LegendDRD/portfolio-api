import nodemailer from 'nodemailer';
import { cLog } from './logger';
import { db } from '../db';
// host: "smtp.office365.com",
// port: 587,
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

export function logEmail(data: any) { // sends logs to all bbc members

    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL_ADDRESS,
        to: process.env.BCC_EMAIL,
        subject: "Current Logger",
        text: data
    };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            // console.log(error);
            cLog('Email sent: ', error, 'criticle');
        } else {
            cLog('Email sent: ', info.response, 'debug', false);
        }
    });

}

