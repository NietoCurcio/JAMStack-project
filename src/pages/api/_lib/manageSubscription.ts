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
  const user = Items.find((item) => item.customerId?.S == customerId)

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // we cannot update any primary key, actually we must create a new one
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValueUpdate.html
  const puItemParams = {
    TableName: 'Users',
    Item: {
      email: { S: user.email.S },
      subscriptionId: { S: subscriptionId },
      customerId: { S: user.customerId.S },
      subscriptionStatus: { S: subscription.status },
    },
  }

  await putItemUsers(puItemParams)
}
