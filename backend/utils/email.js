const nodemailer = require("nodemailer");
const asyncErrorhandler = require("../middleware/asyncErrorhandler");
const { text } = require("express");

const sendemail = async (Option) => {

    try {
        const transpoter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port : process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const emailOptions = {
            from: 'E-commerce suppport<support@ecommerce.com>',
            to: Option.email,
            subject: Option.subject,
            text: Option.message
        }

        await transpoter.sendMail(emailOptions);
    } catch (error) {
        console.error('Error Sending email:',error);
        throw new Error("Error Sending Email");
    }

};

module.exports = sendemail;