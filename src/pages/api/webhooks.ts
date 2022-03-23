import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../services/stripe'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { saveSubscription } from './_lib/manageSubscription'

/*
webhooks are useful for listen for events from an API
example, tell your application that a subscription is not active anymore
*/

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBOOK_SECRET
      )
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
    }

    const { type } = event
    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription

            await saveSubscription(
              subscription.id,
              subscription.customer.toString()
            )
          default:
            throw new Error('Unhandled event.')
        }
      } catch (error) {
        return res.json({ error: 'Webhook handler failed' })
      }
    }

    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
