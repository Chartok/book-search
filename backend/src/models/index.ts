import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { sequelize } from '../db/dbConnection.ts';

// Import model types
import { User } from './User.ts';
import { Book } from './Book.ts';
import { UserSavedBook } from './SavedBook.ts';

// Database interface
interface DB {
	sequelize: Sequelize;
	Sequelize: typeof Sequelize;
	User: typeof User;
	Book: typeof Book;
	UserSavedBook: typeof UserSavedBook;
	[modelName: string]: any;
}

// Initialize db object
const db: DB = {} as DB;

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

// Add models to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Book = Book;
db.UserSavedBook = UserSavedBook;

// Export models and Sequelize instance
export { User, Book, UserSavedBook, sequelize, Sequelize };
export default db;
