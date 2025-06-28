import { DataTypes, Model } from 'sequelize';
import sequelize from './index.ts'

export class SavedBook extends Model {
  public bookId!: number;
  public title!: string;
  public image!: string;
  public userId!: number;
  public status!: 'NEXT' | 'FINISHED';
}

SavedBook.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true, primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('NEXT','FINISHED'),
    allowNull: false,
    defaultValue: 'NEXT',
  },
}, {
  sequelize,
  tableName: 'saved_books',
  timestamps: true,
});

export default SavedBook;
