const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

sgMail.setApiKey(process.env.SENDGRIP_API_TOKEN)

sgMail.send({
    to: 'bdnaeem3@gmail.com',
    from: 'andrew@mead.io',
    subject: 'This is my first creation!',
    text: 'I hope this one actually get to you.'
})