import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    savedBooks: [Book!]!
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String!]
    description: String
    image: String
    link: String
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SaveBookInput {
    bookId: String!
    title: String!
    authors: [String!]
    description: String
    image: String
    link: String
  }

  type Query {
    searchBooks(query: String!): [Book!]!
    user(id: ID!): User
    savedBooks: [Book!]!
  }

  type Mutation {
    registerUser(registerInput: RegisterInput!): User!
    loginUser(loginInput: LoginInput!): User!
    saveBook(book: SaveBookInput!): User!
    removeBook(bookId: String!): User!
  }
`;
