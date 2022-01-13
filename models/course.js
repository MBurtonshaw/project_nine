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
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide estimated time'
                },
                notEmpty: {
                    msg: 'Please provide estimated time'}
            }
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide required materials'
                },
                notEmpty: {
                    msg: 'Please provide required materials'
                }
            }
        },
    },
    { 
        sequelize, 
        modelName: 'Course',
    });
    
    Course.associate = (models) => {
        Course.belongsTo(models.User)
      };

    return Course;
};