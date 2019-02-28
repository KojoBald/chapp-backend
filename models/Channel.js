module.exports = function(sequelize, DataType){                             
    const Channel = sequelize.define('channel', {
        name: {
            type: DataType.STRING,
            allowNull: false
        },
        users: {
            type: DataType.ARRAY(DataType.INTEGER),
            allowNull: false,
            defaultValue: []
        }
    }, {
        hooks: {
            beforeUpdate(channel) {
                if(!channel.users.includes(channel.admin)) {
                    channel.users.unshift(channel.admin);
                }
            }
        }
    })

    const User = sequelize.import('./User');

    Channel.belongsTo(User, { foreignKey: 'admin' });

    return Channel;
}