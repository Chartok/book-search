-- This SQL script sets up the database schema for a book search application.
-- It creates a database named 'book_search' and defines the necessary tables
-- for storing user information and book metadata.

-- Ensure the database is dropped if it already exists
-- This is useful for development purposes to reset the database.
-- In production, you would typically not drop the database but rather alter it as needed.
-- Disable foreign key checks to allow dropping tables without constraints
-- This is necessary to avoid errors when dropping tables that have foreign key constraints.
SET FOREIGN_KEY_CHECKS = 0;
-- Drop the database if it exists to start fresh
DROP DATABASE IF EXISTS book_search;

-- Re-enable foreign key checks after dropping the database
SET FOREIGN_KEY_CHECKS = 1;
-- Create a new database for the book search application
CREATE DATABASE IF NOT EXISTS book_search;
USE book_search;

-- Table to store users
CREATE TABLE IF NOT EXISTS users (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    book_count INT DEFAULT 0,
    saved_books JSON DEFAULT NULL,
);

-- Table to store book metadata
CREATE TABLE IF NOT EXISTS books (
    bookId INT AUTO_INCREMENT PRIMARY KEY,
    authors JSON NOT NULL,
    description VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    nextBook TINYINT(1) DEFAULT NULL,
    finishedBook TINYINT(1) DEFAULT NULL,
    userId INT DEFAULT NULL,
);

-- Join table to track which books a user has saved
-- This is a many-to-many join table between users and books,
-- allowing each user to save multiple books and each book to be saved by multiple users.
CREATE TABLE IF NOT EXISTS user_saved_books (
    user_saved_book_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    UNIQUE KEY user_book_unique (user_id, book_id),
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(bookId) ON DELETE CASCADE
);
