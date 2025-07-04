'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Book', {
      bookId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      authors: {
        type: Sequelize.STRING,
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
          model: 'User',
          key: '_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.addIndex('Book', ['userId'], {
      name: 'book_user_index',
    });
    await queryInterface.addIndex('Book', ['title'], {
      name: 'book_title_index',
    });
    await queryInterface.addIndex('Book', ['authors'], {
      name: 'book_authors_index',
    });
    await queryInterface.addIndex('Book', ['nextBook'], {
      name: 'book_next_index',
    });
    await queryInterface.addIndex('Book', ['finishedBook'], {
      name: 'book_finished_index',
    });

    await queryInterface.addIndex('Book', ['bookId'], {
      name: 'book_id_index',
    });

    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Book');
  }
};
