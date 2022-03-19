// Import required AWS SDK clients and commands for Node.js
import {
  GetItemCommand,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dbbClient'

export const putItemUsers = async (params: PutItemCommandInput) => {
  try {
    const data = await ddbClient.send(new PutItemCommand(params))
    // console.log(data)
    return data
  } catch (err) {
    const msg = err.message
    if (msg == 'The conditional request failed') return

    console.error(err)
    throw new Error('Error creating user in database')
  }
}

export const updateItemUsers = async (params) => {
  try {
    const data = await ddbClient.send(new UpdateItemCommand(params))
    // console.log(data)
    return data
  } catch (err) {
    console.error(err)
    throw new Error('Error updating user in database')
  }
}

export const getItemUsers = async (params) => {
  try {
    console.log(params)
    const data = await ddbClient.send(new GetItemCommand(params))
    return data
  } catch (err) {
    console.error(err)
    throw new Error('Error Getting user from database')
  }
}

export const queryItemUsers = async (params) => {
  try {
    const data = await ddbClient.send(new QueryCommand(params))
    return data
  } catch (err) {
    console.error(err)
  }
}
