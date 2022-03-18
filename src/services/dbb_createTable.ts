import { CreateTableCommand } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dbbClient'

/*
This configuration can also be done in AWS managament console

good read:
https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html
*/

/*
likewise we could have more than one songTitle for an artist, we could have more than one subscription
for an email

also a good read - https://www.alexdebrie.com/posts/dynamodb-one-to-many/
*/

export const params = {
  AttributeDefinitions: [
    {
      AttributeName: 'email',
      AttributeType: 'S',
    },
    // Number of attributes in KeySchema should match number of attributes defined in AttributeDefinitions
    {
      AttributeName: 'subscription_stripe',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'email',
      KeyType: 'HASH',
    },
    /*
    the second Key schema can be only a RANGE key type
    when creating through console we can define only one partition key and one sort key for RANGE
    */
    {
      AttributeName: 'subscription_stripe',
      KeyType: 'RANGE',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: 'Users',
  StreamSpecification: {
    StreamEnabled: false,
  },
}

export const run = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(params))
    console.log('Table Created', data)
    return data
  } catch (err) {
    console.log('Error')
    console.log(err)
  }
}

run()
