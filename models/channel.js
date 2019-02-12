module.exports = function(sequelize, DataType)
{                             
    return sequelize.define('channel',
    {
        name:
        {
            type: DataType.STRING,
            allowNull: false
        },
        users_id:
        {
            type: DataType.ARRAY(DataType.INTEGER),
            allowNull: true
        },
        admin_id:
        {
            type: DataType.INTEGER,
            allowNull: true
        }
    })
}