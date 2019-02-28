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
            allowNull: false
        },
        image: {
            type: DataType.STRING,
            allowNull: true,
            defaultValue: 'https://www.autourdelacom.fr/wp-content/uploads/2018/03/default-user-image.png'
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
            allowNull: true,
            defaultValue: [ 1 ]
        }
    })

    return User;
}