module.exports = function(sequelize, DataType){                              
    const User = sequelize.define('user', {
        username: {
            type: DataType.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataType.STRING,
            allowNull: false
        },
        email: {
            type: DataType.STRING,
            allowNull: false,
            unique: true
        },
        image: {
            type: DataType.STRING,
            allowNull: true
        },
        first: {
            type: DataType.STRING,
            allowNull: false
        },
        last: {
            type: DataType.STRING,
            allowNull: false
        },
        channels: {
            type: DataType.ARRAY(DataType.INTEGER),
            allowNull: true
        }
    })

    return User;
}