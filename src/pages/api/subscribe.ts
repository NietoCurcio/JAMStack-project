import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import {
  queryItemUsers,
  updateItemUsers,
} from '../../services/dynamodbProvider'
import { stripe } from '../../services/stripe'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    /*
    docs
    https://stripe.com/docs/api/checkout/sessions/object
    https://stripe.com/docs/checkout/quickstart
    */

    const queryItemParams = {
      KeyConditionExpression: 'email = :s',
      ExpressionAttributeValues: {
        ':s': { S: session.user.email },
      },
      TableName: 'Users',
    }

    const { Items } = await queryItemUsers(queryItemParams)

    const CustomerId = Items.find((item) => item.customerId)

    let customerId = CustomerId?.customerId?.S

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
      })

      const updateItemParams = {
        TableName: 'Users',
        Key: {
          email: { S: session.user.email },
          subscriptionId: { S: `${null}` },
        },
        ExpressionAttributeNames: { '#t': 'time' }, // time is a reserved keyword
        UpdateExpression:
          'SET customerId = :c, subscriptionStatus = :s, #t = :t',
        ExpressionAttributeValues: {
          ':c': { S: stripeCustomer.id },
          ':s': { S: 'about to become a subscriber' },
          ':t': { S: new Date().toISOString() },
        },
        ReturnValues: 'ALL_NEW',
      }

      await updateItemUsers(updateItemParams)

      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price: 'price_1K24gpDUdOkOs6FutpCtGcK2', quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
