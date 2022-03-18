// Import required AWS SDK clients and commands for Node.js
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dbbClient'

export const params = {
  TableName: 'Users',
  Item: {
    CUSTOMER_ID: { N: '001' },
    email: { S: 'jhondoe@gmail.com' },
  },
}

export const putItem = async () => {
  try {
    const data = await ddbClient.send(new PutItemCommand(params))
    console.log(data)
    return data
  } catch (err) {
    console.error(err)
  }
}
