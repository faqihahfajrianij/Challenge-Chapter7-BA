const prisma = new PrismaClient();

async function registerUser(userData) {
  try {
    const user = await prisma.user.create({ data: userData });
    return user;
  } catch (error) {
    throw new Error('Failed to register user');
  }
}

async function loginUser(email, password) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    return user;
  } catch (error) {
    throw new Error('Failed to login');
  }
}

module.exports = {
  registerUser,
  loginUser,
};
