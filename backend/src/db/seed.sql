-- Insert sample users
-- Note: In a real application, passwords would be hashed, but for seeding purposes we'll insert placeholder data
INSERT INTO users (username, email, password, bookCount, savedBooks) VALUES
('testuser1', 'user1@example.com', 'password123', 2, '{"books":[]}'),
('testuser2', 'user2@example.com', 'password456', 0, '{"books":[]}'),
('testuser3', 'user3@example.com', 'password789', 1, '{"books":[]}');

-- Insert sample books
INSERT INTO books (authors, description, title, image, link, nextBook, finishedBook, userId) VALUES
('["J.K. Rowling"]', 'The first book in the Harry Potter series', 'Harry Potter and the Philosopher\'s Stone', 'http://example.com/image1.jpg', 'http://example.com/book1', 0, 1, NULL),
('["George Orwell"]', 'A dystopian social science fiction novel', '1984', 'http://example.com/image2.jpg', 'http://example.com/book2', 1, 0, NULL),
('["J.R.R. Tolkien"]', 'An epic high-fantasy novel', 'The Lord of the Rings', 'http://example.com/image3.jpg', 'http://example.com/book3', 0, 0, NULL),
('["Jane Austen"]', 'A novel of manners about marriage and social standing', 'Pride and Prejudice', 'http://example.com/image4.jpg', 'http://example.com/book4', 0, 0, NULL),
('["F. Scott Fitzgerald"]', 'A novel about the American Dream during the Jazz Age', 'The Great Gatsby', 'http://example.com/image5.jpg', 'http://example.com/book5', 0, 0, NULL);

