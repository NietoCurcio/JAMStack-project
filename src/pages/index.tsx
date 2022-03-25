import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

/*
Client-side rendering - no need for pre-render data (the user rapidly gets the page, but can have a loading component state)
Server-side rendering (SSR) -  pre-rendering HTML on each request
Static site generation (SSG) - build time

Example: Blog's post

Post content - uses SSG
Post Comments - uses client-side 

Although comments could be used SSR, there's no need to get the comentaries as soon as the page
is loaded, with client-side it will render the compoents after the page is loaded (Hydration process)

Hydration process - JS loads -> React components are initialized and App becomes interactive
https://nextjs.org/learn/basics/data-fetching/pre-rendering
*/

interface HomeProps {
  product: {
    priceId: string
    amount: string
  }
}

const Home = ({ product }: HomeProps) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K24gpDUdOkOs6FutpCtGcK2')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}

/* 
since nextjs uses pre-rendering, so it's optimized to be indexed in google (the google bots, crawlers
will get the page with content)

Application flow:

Stripe (payment, has a very helpful API), subscription ->

Github OAuth authentication ->

FaunaDB (this database works very well with serverless applications, like Nextjs API routes),
other example is DynamoDB which will be used in this code, 
in the DB will be stored subscription data of the user,
other great services we have Firebase, Supabase -> 

Prismic CMS - Content managament system - manage the content of a application,
serve the content of the website (a blog for example) through an API.

serverless - each route in our application will be executed in a isolated environment. Instead of the resource
being served all the time by the programmer, the cloud provider could for example instaciate a virtual machine to 
serve that resource in a scalable way, all this is handled by the cloud provider, like AWS, Azure, Google Cloud.

*/

export default Home
