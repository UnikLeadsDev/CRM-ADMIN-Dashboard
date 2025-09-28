const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'channelpartner.cwniws4uuerg.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'channelpartner',
  database: 'channelpartner',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
