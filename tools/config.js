const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  RPC_URL: process.env.RPC_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY
};
