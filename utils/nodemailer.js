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

const sendEmail = async (mailOptions) => {
  try {
    // Kirim email dengan menggunakan transporter yang telah dikonfigurasi sebelumnya
    const info = await transporter.sendMail(mailOptions);
    console.log('Email berhasil dikirim:', info.response);
    return true;
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    return false;
  }
};

module.exports = sendEmail;
