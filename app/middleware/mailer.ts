import nodemailer from "nodemailer";
import { MAIL_ENCRYPTION, MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from "../config/config";

// async..await is not allowed in global scope, must use a wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMail(item: any) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: MAIL_ENCRYPTION === "TLS" || MAIL_ENCRYPTION === "STARTTLS",
        requireTLS: MAIL_ENCRYPTION === "STARTTLS",
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: item.from,
        to: item.to,
        subject: item.subject,
        text: item.text,
        html: item.html,
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
