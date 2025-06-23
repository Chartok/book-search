import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      id
      username
      email
      token
    }
  }
`;

export const REGISTER_USER = gql`
  mutation registerUser($registerInput: RegisterInput!) {
    registerUser(registerInput: $registerInput) {
      id
      username
      email
      token
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook($book: SaveBookInput!) {
    saveBook(book: $book) {
      id
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      id
      savedBooks {
        bookId
      }
    }
  }
`;
