module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        user: {
            type: DataTypes.INTEGER,
            allowNull: false
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