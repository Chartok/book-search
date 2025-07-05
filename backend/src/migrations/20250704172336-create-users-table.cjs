'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			_id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bookCount: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			savedBooks: {
				type: Sequelize.JSON,
				defaultValue: [],
			},
		});

		// Adding indexes for performance optimization
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	},
};
