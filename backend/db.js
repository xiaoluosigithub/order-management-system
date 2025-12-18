const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'shop_order_db',
  charset: 'utf8mb4'
});

module.exports = pool;
