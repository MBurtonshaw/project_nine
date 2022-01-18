const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a 1st name'
                },
                notEmpty: {
                    msg: 'Please provide a 1st name'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a last name'
                },
                notEmpty: {
                    msg: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'This email address has already been used'
            },
            validate: {
                notNull: {
                    msg: 'Please provide an email address'
                },
                notEmpty: {
                    msg: 'Please provide an email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            len: {
                args: [8, 20],
                msg: 'Password must be between 8 and 20 characters long'
            },
            validate: {
                notNull: {
                    msg: 'Please provide a password'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                }
            }
        }
        },
    { 
        timestamps: false,
        modelName : 'User',
        sequelize
    });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId'
            }
        })
      };

    return User;
};