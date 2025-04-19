const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.db_host || "localhost",
  port: process.env.db_port || "3306",
  user: process.env.db_user || "root",
  password: process.env.db_pass || "root",
  database: process.env.db_name || "ireland_mosques",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // 👈 important
});

module.exports = pool;
