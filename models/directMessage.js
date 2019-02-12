module.exports = (sequelize, DataTypes) => {
    const DirectMessage = sequelize.define('directmessage', {
        username: {
            type: DataTypes.INTEGER,
        },
        channel: {
            type: DataTypes.INTEGER,
        },
        to: {
            type: DataTypes.INTEGER,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return DirectMessage;
};