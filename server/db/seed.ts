import 'dotenv/config';
import { sequelize } from '../models/index.ts';
import { Book } from '../models/Book.ts';
import { User } from '../models/User.ts';

async function seed() {
	try {
		await sequelize.sync({ force: true });
		console.log('✅ database synced');

		await User.bulkCreate(
			[
				{
					username: 'alice',
					email: 'alice@example.com',
					password: 'alicepassword123!',
				},
				{
					username: 'bob',
					email: 'bob@example.com',
					password: 'bobpassword123!',
				},
			],
			{
				individualHooks: true,
			}
		);

		await Book.bulkCreate([
{
    title:       'The Hobbit',
    authors:     ['J.R.R. Tolkien'],       // must be JSON
    description: 'A fantasy novel about Bilbo Baggins and his quest.',
    image:       'https://covers.openlibrary.org/b/id/8108691-L.jpg',
    link:        'https://openlibrary.org/books/OL7353617M/The_Hobbit',
    nextBook:    false,                    // allowNull true, so optional
    finishedBook:false
  },
  {
    title:       '1984',
    authors:     ['George Orwell'],
    description: 'A dystopian novel depicting a totalitarian regime.',
    image:       'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    link:        'https://openlibrary.org/books/OL7343675M/1984',
    nextBook:    false,
    finishedBook:false
  },
		]);

		console.log('✅ seeding complete');
	} catch (err) {
		console.error('Failed to seed database:', err);
	} finally {
		await sequelize.close();
	}
}

seed();
