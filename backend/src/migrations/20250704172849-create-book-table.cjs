'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Books', {
			bookId: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			authors: {
				type: Sequelize.JSON,
				allowNull: false,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			cover: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			link: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			nextBook: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: true,
			},
			finishedBook: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: true,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'Users', // Corrected from 'User' to 'Users'
					key: '_id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Books');
	},
};
