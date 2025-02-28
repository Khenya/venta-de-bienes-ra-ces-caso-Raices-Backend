const bcrypt = require('bcryptjs');

const password = 'password';

async function hashPassword() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Contraseña Hasheada:', hashedPassword);
}

hashPassword();
