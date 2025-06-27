import { createUserModel } from './User';
import { createBookModel } from './Book';
import sequelize from '../config/connection';
import { connectToDB } from '../config/connection';

// Connect to the database
(async () => {
  const db = await connectToDB();
  // Only force sync in non-production environments
  try {
    await db.sync({ force: true }); // Reset the database only if not in production
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  } finally {
    // Ensure all pending operations are completed before closing the connection
    await db.close();
  }
})().catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);
})();

export const User = createUserModel(sequelize);
export const Book = createBookModel(sequelize);
