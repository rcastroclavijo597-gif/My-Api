import mysql from "mysql2/promise";

// Conexión a MySQL. La clave sale del .env
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "tienda",
});
