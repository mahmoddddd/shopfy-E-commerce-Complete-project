const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.PASS_MAIL
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let info = await transporter.sendMail({
        from: '"Hey😊" <fooo@gmail.com>',
        to: data.to,
        subject: 'Password Reset Request',
        text: data.text,
        html: data.html
    });

    console.log('Email sent: ' + info.response);
    console.log("Preview Url : %s", nodemailer.getTestMessageUrl(info));
});

module.exports = sendEmail;
