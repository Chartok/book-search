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
			passwordHash: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: Sequelize.DATE,
			updatedAt: Sequelize.DATE,
		});

		// Adding indexes for performance optimization

	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	},
};
