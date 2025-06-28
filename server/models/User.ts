import { DataTypes } from 'sequelize';
import { sequelize } from './index.ts'
import bcrypt from 'bcrypt';
import { Book } from './Book.ts';

export const User = sequelize.define('User', {
	_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	bookCount: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	savedBooks: {
		type: DataTypes.JSON, // Assuming savedBooks is an array of Book objects
		defaultValue: [],
	},
}, {
	sequelize,
	timestamps: false, // Disable createdAt and updatedAt fields
	hooks: {

		beforeCreate: async (user: User) => {
			user.password = await bcrypt.hash(user.password, 10);
		},

		beforeUpdate: async (user: User) => {
			if (user.changed('password')) {
				user.password = await bcrypt.hash(user.password, 10);
			}
		}
	},
	instanceMethods: {
		async isCorrectPassword(password: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
		}
	},

});

// Associations

User.hasMany(Book, {
	foreignKey: 'userId',
	as: 'books',
});

Book.belongsTo(User, {
	foreignKey: 'userId',
	as: 'user',
});

export default User;

// This file defines the User model for a Sequelize ORM setup, including password hashing and associations with a Book model.
