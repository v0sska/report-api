export const config = {
  server: {
    crypto: process.env.CRYPTO_SECRET,
    jwt: process.env.JWT_ACCESS_SECRET,
  },
};

export default config;
