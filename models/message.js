module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        username: {
            type: DataTypes.INTEGER,
        },
        channel: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Message;
};