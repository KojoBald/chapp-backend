module.exports = function(sequelize, DataType){                             
    const Channel = sequelize.define('channel', {
        name: {
            type: DataType.STRING,
            allowNull: false
        },
        users: {
            type: DataType.ARRAY(DataType.INTEGER),
            allowNull: false
        }
    })

    const User = sequelize.import('./User');

    Channel.belongsTo(User, { foreignKey: 'admin' });

    return Channel;
}