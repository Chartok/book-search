import { gql } from 'graphql-tag';

export const typeDefs = gql`
	type Book {
		bookId: String!
		authors: [String]
		description: String!
		title: String!
		image: String
		link: String
	}

	input BookInput {
		bookId: String!
		authors: [String]
		description: String!
		title: String!
		image: String
		link: String
	}

	type User {
		_id: ID!
		username: String!
		email: String!
		bookCount: Int
		savedBooks: [Book]
	}

	type AuthPayload {
		token: ID!
		user: User
	}

	type Query {
		me: User
	}

	type Mutation {
		authenticate(
			email: String!
			username: String!
			password: String!
		): AuthPayload!
		login(username: String!, password: String!): AuthPayload
		addUser(username: String!, email: String!, password: String!): AuthPayload
		saveBook(input: BookInput!): User
		removeBook(bookId: String!): User
	}
`;
