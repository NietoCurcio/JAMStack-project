import Stripe from 'stripe'
import pkg from '../../package.json'

export const stripe = new Stripe(process.env.STRIPE_API_KEY as any, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Ignews',
    version: pkg.version,
  },
})
