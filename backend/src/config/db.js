import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // 🔥 load .env

const dbConfig = process.env.DATABASE_URL || process.env.MYSQL_URL ? {
  uri: process.env.DATABASE_URL || process.env.MYSQL_URL,
} : {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

export const db = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
