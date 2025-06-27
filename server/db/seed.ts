import 'dotenv/config';
import { connectToDB } from '../config/connection.ts';
import { User } from '../models/index.ts';

(async () => {
  const db = await connectToDB();
  // Only force sync in non-production environments
  try {
    await db.sync({ force: false }); // Reset the database only if not in production
    console.log('Database synchronized successfully');
    await User.bulkCreate([
      { username: 'foo', email: 'foobar@example.com', password: 'foo123'},
      { username: 'bar', email: 'barfoo@example.com', password: 'bar123'},
    ], { individualHooks: true });

    console.log('Database seeded successfully');
  } finally {
    // Ensure all pending operations are completed before closing the connection
    await db.close();
  }
})();

seed().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});
