const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }),
    { 
        sequelize,
        modelName : 'User'
    };

    /*User.associate = (models) => {
        User.hasMany(models.Course),
        {
            as: 'student',
            foreignKey: {
                fieldName: 'userId',
                name: models.User.id,
                allowNull: false
            }
        }
    };*/

    return User;
};