module.exports = (sequelize, DataTypes) => {
    const DirectMessage = sequelize.define('direct_message', {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    const User = sequelize.import('./User');

    DirectMessage.belongsTo(User, { foreignKey: 'from' });
    DirectMessage.belongsTo(User, { foreignKey: 'to' });

    return DirectMessage;
};