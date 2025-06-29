import { sequelize } from './index.ts'
import { User } from './User.ts';
import { Book } from './Book.ts';
import { SavedBook } from './SavedBook.ts'

export const UserBooks = sequelize.define('UserBooks', {});

User.belongsToMany(Book, { through: UserBooks });
Book.belongsToMany(User, { through: UserBooks });
SavedBook.belongsTo(User, { foreignKey: 'userId' });
SavedBook.belongsTo(Book, { foreignKey: 'bookId' });

export default UserBooks;
