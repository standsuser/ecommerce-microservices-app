/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-var-requires */
const sgMail = require('@sendgrid/mail');

export class Mailservice {
    constructor(apiKey) {
        sgMail.setApiKey(apiKey);
    }

    async sendMail(mailOptions) {
        try {
            await sgMail.send(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}

