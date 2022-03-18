# Nextjs - JAMSTACK Project

reads:

https://www.netlify.com/jamstack/

https://en.wikipedia.org/wiki/Jamstack

https://jamstack.org/

https://umbraco.com/knowledge-base/jamstack/

https://jamstack.wtf/

## API Routes & Serverless

### DynamoDB

DynamoDB primary key for a _Table_ can be composed by two attributes, a _Partition key_ and a _Sort key_. One example shown [in the documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html) is that the Music Table uses Artist as the Partition key and SongTitle for Sort Key.

This project uses the user email as Partition key and the subscription ID provided by the Stripe API, since an user could have more than a subscription.

In order to set up the AWS SDK, the [shared credentials file](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html) was properly configured through an administrator IAM user.

### Stripe

## SSR and SSG
