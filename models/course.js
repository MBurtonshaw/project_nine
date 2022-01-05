const { Model } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class Course extends Model {};
    Course.init({
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        estimatedTime: {
            type: DataTypes.STRING
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
        Course.belongsTo(models.user);
    };

    return Course;
};