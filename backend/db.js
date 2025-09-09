import mysql from "mysql2/promise";

import "dotenv/config";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((connection) => {
    console.log("¡Conectado a la base de datos MySQL!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error al conectar con la base de datos:", err);
  });
