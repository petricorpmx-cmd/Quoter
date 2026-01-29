// Configuración de conexión a Azure SQL Database
const sql = require('mssql');

let pool = null;

const config = {
  server: process.env.SQL_SERVER || '',
  database: process.env.SQL_DATABASE || '',
  user: process.env.SQL_USER || '',
  password: process.env.SQL_PASSWORD || '',
  options: {
    encrypt: true, // Azure requiere encriptación
    trustServerCertificate: false,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conectado a Azure SQL Database');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a Azure SQL Database:', error);
    throw error;
  }
}

async function closeConnection() {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✅ Conexión cerrada');
    }
  } catch (error) {
    console.error('❌ Error cerrando conexión:', error);
  }
}

module.exports = {
  getConnection,
  closeConnection,
  sql
};
