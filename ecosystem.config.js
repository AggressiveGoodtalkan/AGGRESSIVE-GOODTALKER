module.exports = {
    apps : [{
      name: "AGT-bot",
      script: "./index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
};
