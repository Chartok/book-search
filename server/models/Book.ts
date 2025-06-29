import { sequelize } from './index.ts'
import { DataTypes } from 'sequelize';

export const Book = sequelize.define('Book', {
  bookId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authors: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nextBook: {
    type: DataTypes.BOOLEAN,
  },
  finishedBook: {
    type: DataTypes.BOOLEAN,
  },
  
  }, {
    timestamps: false,
  }
)

export default Book;
