const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'fypbunyadclick7@gmail.com',
        pass: 'ytcffqecvlehopii'
    }
});
module.exports={transporter}