# Nextjs - JAMSTACK Project

reads:

https://www.netlify.com/jamstack/

https://en.wikipedia.org/wiki/Jamstack

https://jamstack.org/

https://umbraco.com/knowledge-base/jamstack/

https://jamstack.wtf/

## API Routes & Serverless

### DynamoDB

<img width="100" height="100" src="https://avatars.githubusercontent.com/u/51931239?v=4">

DynamoDB primary key for a _Table_ can be composed by two attributes, a _Partition key_ and a _Sort key_. One example shown [in the documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html) is that the Music Table uses Artist as the Partition key and SongTitle for Sort Key. It means a Artist can have many songs, in our case, a user can have many subscriptions, then the Sort key design is architetured as shown in documentation: [Best Practices for Using Sort Keys to Organize Data](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-sort-keys.html)

This project uses the user email as Partition key and the subscription ID provided by the Stripe API, since an user could have more than a subscription.

In order to set up the AWS SDK, the [shared credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html) was properly configured through an administrator IAM user.

### Stripe

## SSR and SSG
