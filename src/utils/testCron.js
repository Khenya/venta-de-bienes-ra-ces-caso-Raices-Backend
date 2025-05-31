require('dotenv').config();

const { checkOverdueInstallments } = require('./cronJob');

async function testCronJob() {
  try {
    console.log("🚀 Iniciando prueba del cron job...");
    await checkOverdueInstallments();
    console.log("🏁 Prueba completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("💥 Error durante la prueba:", error);
    process.exit(1);
  }
}

testCronJob();