const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

exports.registerUser = async (req, res) => {
  try {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({message: 'Semua harus diisi'});
      }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
      return res.status(400).json({message: 'Email sudah terdaftar'});
    }

    // Hash password sebelum disimpan di database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat pengguna baru dengan password yang sudah dihash
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({message: 'Pendaftaran berhasil', user: newUser});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Terjadi kesalahan saat pendaftaran pengguna'});
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({message: 'Email dan password harus diisi'});
    }
    // Mencari pengguna berdasarkan email
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (!existingUser) {
      return res.status(404).json({message: 'Pengguna tidak ditemukan'});
    }

    // Verifikasi password menggunakan bcrypt
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({message: 'Email dan password tidak cocok'});
    }

    return res.status(200).json({message: 'Login berhasil', user: existingUser});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Terjadi kesalahan saat login'});
  }
};
