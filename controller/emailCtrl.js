const modemailer = require('nodemailer')

const asyncHandler = require('express-async-handler')



const sendEmail = asyncHandler(async (data, req, res,) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,

        service: 'gmail',
        auth: {
            user: 'alshryfmhmwd6688@gmail.com', // Your email
            pass: '123456789@*123' // Your password
        }
    });

    // Example function to send a password reset email
    let info = await transporter.sendEmail({// Email content

        from: '"Hey😊" <fooo@gmail.com>',
        to: data.subject, // recipient email
        subject: 'Password Reset Request',
        text: data.text,
        html: data.html
        // `Hello ${user.username},\n\n`
        //     + 'You have requested a password reset. '
        //     + 'Please click on the following link to reset your password:\n\n'
        //     + `http://yourwebsite.com/reset?token=${resetToken}\n\n`
        //     + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    })


    // Send the email
    console.log('Email sent: ' + info.response);

    console.log("Preview Url : %s", nodemailer.getTestMessageUrl(info))



})
module.exports = sendEmail