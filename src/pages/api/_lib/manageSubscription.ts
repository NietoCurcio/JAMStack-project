import {
  putItemUsers,
  queryItemUsers,
} from '../../../services/dynamodbProvider'
import { stripe } from '../../../services/stripe'

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  const queryItemParams = {
    TableName: 'Users',
    IndexName: 'customerId-index',
    KeyConditionExpression: 'customerId = :c',
    ExpressionAttributeValues: {
      ':c': { S: customerId },
    },
  }

  const { Items } = await queryItemUsers(queryItemParams)
  const [user] = Items.sort((a, b) => {
    const newest: any = new Date(b.time.S)
    const oldest: any = new Date(a.time.S)
    return newest - oldest
  })

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  /* we cannot update any primary key, actually we must create a new one
     https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValueUpdate.html

     https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
     "Creates a new item, or replaces an old item with a new item. If an item that has the same
     primary key as the new item already exists in the specified table, the new item completely
     replaces the existing item."" 
  */
  const puItemParams = {
    TableName: 'Users',
    Item: {
      email: { S: user.email.S },
      subscriptionId: { S: subscriptionId },
      customerId: { S: user.customerId.S },
      subscriptionStatus: { S: subscription.status },
      time: { S: new Date().toISOString() },
    },
  }

  await putItemUsers(puItemParams)
}
