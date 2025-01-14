export const config = {
  server: {
    crypto: process.env.CRYPTO_SECRET,
    jwt: process.env.JWT_ACCESS_SECRET,
    url: process.env.SERVER_URL,
    frontendUrl: process.env.FRONTEND_URL,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export default config;
