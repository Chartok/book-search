import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/dbConnection.ts';

import User from './User.ts';
import Book from './Book.ts';
import UserSavedBook from './SavedBook.ts';

// Define associations
User.hasMany(UserSavedBook, {
	foreignKey: 'user_id',
	sourceKey: '_id',
});
UserSavedBook.belongsTo(User, {
	foreignKey: 'user_id',
	targetKey: '_id',
});

Book.hasMany(UserSavedBook, {
	foreignKey: 'book_id',
	sourceKey: 'bookId',
});
UserSavedBook.belongsTo(Book, {
	foreignKey: 'book_id',
	targetKey: 'bookId',
});

// Sync models with the database
const syncModels = async () => {
	await sequelize.sync({ alter: true });
};
syncModels()
  .then(() => console.log('Models synced successfully'))
  .catch(err => console.error('Error syncing models:', err));

// Export models
export { User, Book, UserSavedBook, sequelize, Sequelize };
