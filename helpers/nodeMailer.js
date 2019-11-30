"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    }
});

function sendMail(to, text) {
    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.MAIL,
        to,
        subject: "hack0verflow",
        html: text
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else {
            console.log(info.response);
        }
    })

}

module.exports = sendMail;
