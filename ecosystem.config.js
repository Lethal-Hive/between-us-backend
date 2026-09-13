//pm2 start ecosystem.config.js --env [env name]
//ref: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'between-us-be-revamp',
      script: 'dist/main.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
