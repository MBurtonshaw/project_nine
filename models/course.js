const { Model } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class Course extends Model {};
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        materialsNeeded: {
            type: DataTypes.STRING
        },
    }),
    { 
        sequelize, 
        modelName: 'Course',
    };

    Course.associate = (models) => {
        Course.belongsTo(models.User),
        {
            as: 'student',
            foreignKey: {
                fieldName: 'userId',
                name: models.User.id,
                allowNull: false
            }
        }
    };

    return Course;
};