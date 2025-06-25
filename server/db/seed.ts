import { connectToDatabase } from '../config/connection.ts';
import { createUserModel } from '../models/User.ts';

async function seed() {
  const sequelize = await connectToDatabase();
  const User = createUserModel(sequelize);
  await sequelize.sync({ force: true });

  await User.bulkCreate([
    { username: 'foo', email: 'foobar@example.com', password: 'foo123'},
    { username: 'bar', email: 'barfoo@example.com', password: 'bar123'},
  ]);

  console.log('Database seeded successfully');
  await sequelize.close();
}

seed().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});
