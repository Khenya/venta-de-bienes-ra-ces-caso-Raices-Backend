const bcrypt = require('bcryptjs');

const password = 'I7-4dm1n1str4d0r-7I';

async function hashPassword() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Contraseña Hasheada:', hashedPassword);
}

hashPassword();
