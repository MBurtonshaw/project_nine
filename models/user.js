const { Model } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class User extends Model {};
    User.init({
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
    }),
    { 
        sequelize, 
        modelName: 'User',
    };

    User.associate = (models) => {
        User.hasMany(models.course);
    };

    return User;
};