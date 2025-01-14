export const config = {
  server: {
    crypto: process.env.CRYPTO_SECRET,
    jwt: process.env.JWT_ACCESS_SECRET,
    url: process.env.SERVER_URL,
    frontendUrl: process.env.FRONTEND_URL,
  },
};

export default config;
