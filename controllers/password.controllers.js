const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

exports.forgotPassword = async (req, res) => {
  try {
    const {email} = req.body;
    if (!email) {
      return res.status(400).json({message: 'Email harus diisi'});
    }

    // Mencari pengguna berdasarkan email
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (!existingUser) {
      return res.status(404).json({message: 'Pengguna tidak ditemukan'});
    }


    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const resetToken = 'token_reset_password'; 

    // Konten email reset password
    const mailOptions = {
      from: 'faqihahphysics@gmail.com', 
      to: email,
      subject: 'Reset Password',
      html: `
        <p>Silakan klik <a href="http://localhost:3000/api/v1/auth/reset_password/${resetToken}">tautan ini</a> untuk mereset password Anda.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      `,
    };

    // Kirim email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({message: 'Gagal mengirim email reset password'});
      } else {
        console.log('Email reset password berhasil dikirim: ' + info.response);
        return res.status(200).json({message: 'Email untuk reset password telah dikirim'});
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Terjadi kesalahan saat permintaan reset password'});
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({message: 'Email dan password baru harus diisi'});
    }

    // Cari pengguna berdasarkan email
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (!existingUser) {
      return res.status(404).json({message: 'Pengguna tidak ditemukan'});
    }

    // Hash password baru sebelum menyimpan ke dalam database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Perbarui password pengguna
    await prisma.user.update({
      where: {email},
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).json({message: 'Password berhasil direset'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Terjadi kesalahan saat reset password'});
  }
};
