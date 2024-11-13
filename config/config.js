require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  jwtExpiresIn: '1h',
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
};
