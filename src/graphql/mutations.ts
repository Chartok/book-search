import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!) {
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const AUTHENTICATE = gql`
	mutation authenticate($email: String!, $username: String!, $password: String!) {
		authenticate(email: $email, username: $username, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const SAVE_BOOK = gql`
	mutation saveBook($input: BookInput!) {
		saveBook(input: $input) {
			_id
			username
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
	mutation removeBook($bookId: String!) {
		removeBook(bookId: $bookId) {
			_id
			username
			savedBooks {
				bookId
			}
		}
	}
`;
