module.exports = (sequelize, DataTypes) => {
    const DirectMessage = sequelize.define('directmessage', {
        from: {
            type: DataTypes.INTEGER
        },
        to: {
            type: DataTypes.INTEGER
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return DirectMessage;
};