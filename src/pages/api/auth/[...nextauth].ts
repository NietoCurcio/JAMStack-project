import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { putItemUsers } from '../../../services/dynamodbProvider'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  // "Callbacks are asynchronous functions you can use to control what happens when an action is performed"
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html#Expressions.ConditionExpressions.PreventingOverwrites
      const params = {
        TableName: 'Users',
        Item: {
          email: { S: user.email },
          subscriptionId: { S: `${null}` },
          subscriptionStatus: { S: 'non subscriber' },
        },
        ConditionExpression: 'attribute_not_exists(email)',
      }

      try {
        await putItemUsers(params)
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
  },
})

/*

  authentication strategies:
  JWT - Browser Storage, can be used with a refresh token
  Next Auth -
    1 - simple authentication
    2 - also for social authentication (OAuth)
    3 - when we do not want to maintain user credentials
  Cognito AWS, Auth0 (services for authentication)

  api routes, getServerSideProps and getStaticProps are executed server-side

  serverless: the api routes will not be a server (running 24h awaiting for a request), actually
  when the route/resource is called, it will scale a isolated environment and execute the route,
  as soon as it sends the response the envrionment closes/ends. Serverless it will up a isolated
  environment or down this env as as needed
*/
