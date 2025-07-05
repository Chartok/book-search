'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('user_saved_books', {
			user_saved_book_id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'User',
					key: '_id',
				},
			},
			book_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Book',
					key: 'bookId',
				},
			},
			shelf: {
				type: Sequelize.ENUM('next', 'finished'),
				allowNull: false,
				defaultValue: 'next',
			},
		});
		await queryInterface.addIndex('user_saved_books', ['user_id', 'book_id'], {
			unique: true,
			name: 'user_book_unique_index',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('user_saved_books'); // Drop the user_saved_books table
		await queryInterface.dropTable('user_saved_books');
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_user_saved_books_shelf";'
			'DROP TYPE IF EXISTS "enum_user_saved_books_shelf";'
		); // Drop the ENUM type if it exists
	},
};
