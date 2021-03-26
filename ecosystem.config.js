module.exports = {
  apps: [
    {
      name: 'marketplace-backend',
      script: './dist/main.js',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: true,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
