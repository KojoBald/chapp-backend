module.exports = (sequelize, DataTypes) => {
    const ChannelMessage = sequelize.define('channel_message', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    const User = sequelize.import('./User');
    const Channel = sequelize.import('./Channel');

    ChannelMessage.belongsTo(User, { foreignKey: 'userId' });
    ChannelMessage.belongsTo(Channel, { foreignKey: 'channelId' });

    return ChannelMessage;
};