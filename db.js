const Sequelize = require('sequelize');
let db = _parseDatabaseUri();

const sequelize = new Sequelize(db.name, db.user, db.password, {
    dialect: 'postgres',
    protocol: 'postgres',
    host: db.host,
    port: db.port,
    // dialectOptions: { ssl: true },
    logging: false
});

sequelize.authenticate()
    .then(() => console.log(`connected to ${db.name} at ${db.host} on port ${db.port} as ${db.user}`))  
    .catch(err => console.error(err))

module.exports = sequelize;

function _parseDatabaseUri() {
    let match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    return {
        user: match[1],
        password: match[2],
        host: match[3],
        port: match[4],
        name: match[5]
    }
}











// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('postgresql://postgres:otis2016@localhost/Chapp', 
// {
//     dialect: 'postgres'  
// })
 
// sequelize.authenticate().then(
//     function()
//     {
//         console.log('connected to postgres db')
//     },
//     function(err)
//     {
//         console.log(err)
//     }
// )

// module.exports = sequelize;