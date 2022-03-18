// Import required AWS SDK clients and commands for Node.js
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dbbClient'

export const putItemUsers = async (params: PutItemCommandInput) => {
  try {
    const data = await ddbClient.send(new PutItemCommand(params))
    console.log(data)
    return data
  } catch (err) {
    const msg = err.message
    if (msg == 'The conditional request failed') return

    console.error(err)
    throw new Error('Error creating user in database')
  }
}
