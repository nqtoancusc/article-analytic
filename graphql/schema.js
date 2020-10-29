/*
 - Schema: The schema describes the structure of the queries.
- Query: All GET requests that do not intend to create or update 
any resources are called query.
- Mutation: All POST, PUT, and DELETE requests are mutations in GraphQL.
*/
const { buildSchema } = require('graphql');
/*
module.exports = buildSchema(`
    type ProjectMetaData {
        name: String!
        description: String!
        version: Int!
    }

    type RootQuery {
        project: ProjectMetaData
    }

    schema {
        query: RootQuery
    }
`);
*/

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
        name: String!
        email: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput:PostInputData): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);