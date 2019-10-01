module.exports = {
  apps : [{
    name: 'D&D Shop Backend',
    script: 'app.js',
    args: 'one two',
    // instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      PORT: 4000,
      NODE_ENV: 'development'
    },
    env_production: {
      PORT: 80,
      NODE_ENV: 'production'
    }
  }],
};
