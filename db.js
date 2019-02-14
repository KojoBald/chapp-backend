const Sequelize = require('sequelize'); 

const sequelize = new Sequelize(process.env.DATABASE_NAME, 'postgres', process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres'
})
 
sequelize.authenticate().then(
    function() {
        console.log('connected')
    },
    function(err) {
        console.log(err)
    }
)

module.exports = sequelize;