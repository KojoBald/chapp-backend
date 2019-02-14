module.exports = function(sequelize, DataType)
{                             
    return sequelize.define('channel',
    {
        name:
        {
            type: DataType.STRING,
            allowNull: false
        },
        users:
        {
            type: DataType.ARRAY(DataType.INTEGER),
            allowNull: false
        },
        admin_id:
        {
            type: DataType.INTEGER,
            allowNull: true
        }
    })
}