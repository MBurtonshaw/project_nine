const { Model } = require('sequelize');

  module.exports = (sequelize, DataTypes) => {
    class Course extends Model {};
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide course title'
                },
                notEmpty: {
                    msg: 'Please provide course title'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide course title'
                },
                notEmpty: {
                    msg: 'Please provide course title'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        },
    },
    { 
        modelName: 'Course',
        sequelize
    });
    
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        })
      };

    return Course;
};