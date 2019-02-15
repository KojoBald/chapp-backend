const sequelize = require('sequelize-heroku').connect(require('sequelize'));

if(sequelize) {
    sequelize.authenticate()
        .then(() => {
            let config = sequelize.connectionManager.config;
            console.log(`sequelize-heroku: connected to ${config.host} as ${config.username}`)
        }).catch(error => {
            let config = sequelize.connectionManager.config;
            console.error(`sequelize-heroku: error connecting to ${config.host} as ${config.user}\nError: ${error.message}`)
        })
} else {
    console.error('no connection environment variable found');
}

module.exports = sequelize;