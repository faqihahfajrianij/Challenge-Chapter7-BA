const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});


async function sendMail(to, subject, text) {
  try {
    const mailOptions = {
      from: emailUser,
      to: to,
      subject: subject,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Failed to send email');
  }
}

module.exports = {
  sendMail
};
