import 'dotenv/config';
import { sequelize } from '../models/index.ts';
import { Book }      from '../models/Book.ts';
import { User }      from '../models/User.ts';

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ database synced');

    await User.bulkCreate([
      { username: 'alice' },
      { username: 'bob' },
    ]);

    await Book.bulkCreate([
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: '1984',       author: 'George Orwell' },
    ]);

    console.log('✅ seeding complete');
  } catch (err) {
    console.error('Failed to seed database:', err);
  } finally {
    await sequelize.close();
  }
}

seed();
