This is ReadMe for the Backend of the timelife app

I. Architechture
* This is a graphql api built in TypeScript,js
* TypeORM is the Object Relational Manegement (ORM) library
* Type-GraphQL is the GraphQl library
* ApolloServer is the GraphQL server with an Express middleware
* It expects a PostgreSQL database


II. Running locally

1. If you've already started the PostgreSQL database ignore, if not:
* cd timelife
* docker-compose.up

2. Install the necessary packages:
* cd tsGqlBackedn
* yarn

3. Open a new terminal and continuously compile the javascript bundle
* cd tsGqlBackedn
* yarn watch 

4. Open a new terminal and run the javascript bundle
* cd tsGqlBackedn
* yarn dev




