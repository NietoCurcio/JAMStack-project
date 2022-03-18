import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { ListTablesCommand } from '@aws-sdk/client-dynamodb'

const REGION = 'us-east-1'

export const ddbClient = new DynamoDBClient({ region: REGION })

export const describeTable = async () => {
  try {
    const data = await ddbClient.send(
      new DescribeTableCommand({ TableName: 'Users' })
    )
    console.log('Success', data)
    return data
  } catch (err) {
    console.log('Error', err)
  }
}

export const listTables = async () => {
  try {
    const data = await ddbClient.send(new ListTablesCommand({}))
    console.log(data)
    return data
  } catch (err) {
    console.error(err)
  }
}
