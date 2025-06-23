import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Resolvers } from '@apollo/server';

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string };
    infoLink?: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: Book[];
}

interface Book {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

const SECRET = 'replace-this-secret';

const users: User[] = [];

function generateToken(user: User) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: '2h',
  });
}

export const resolvers: Resolvers = {
  Query: {
    async searchBooks(_, { query }) {
      const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: { q: query },
      });
      return (
        res.data.items || []
      ).map((item: GoogleBook) => ({
        bookId: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        description: item.volumeInfo.description,
        image: item.volumeInfo.imageLinks?.thumbnail,
        link: item.volumeInfo.infoLink,
      }));
    },
    user(_, { id }) {
      return users.find(u => u.id === id) || null;
    },
    savedBooks(_, __, { user }) {
      if (!user) throw new Error('Not authenticated');
      const found = users.find(u => u.id === user.id);
      return found ? found.savedBooks : [];
    },
  },
  Mutation: {
    registerUser(_, { registerInput }) {
      const newUser: User = {
        id: uuidv4(),
        username: registerInput.username,
        email: registerInput.email,
        password: registerInput.password,
        savedBooks: [],
      };
      const token = generateToken(newUser);
      users.push(newUser);
      return { ...newUser, token };
    },
    loginUser(_, { loginInput }) {
      const user = users.find(u => u.email === loginInput.email && u.password === loginInput.password);
      if (!user) throw new Error('Incorrect email or password');
      return { ...user, token: generateToken(user) };
    },
    saveBook(_, { book }, { user }) {
      if (!user) throw new Error('Not authenticated');
      const found = users.find(u => u.id === user.id);
      if (!found) throw new Error('User not found');
      if (!found.savedBooks.some(b => b.bookId === book.bookId)) {
        found.savedBooks.push(book);
      }
      return found;
    },
    removeBook(_, { bookId }, { user }) {
      if (!user) throw new Error('Not authenticated');
      const found = users.find(u => u.id === user.id);
      if (!found) throw new Error('User not found');
      found.savedBooks = found.savedBooks.filter(b => b.bookId !== bookId);
      return found;
    },
  },
};
