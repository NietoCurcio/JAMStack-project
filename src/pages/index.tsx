import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>
      <h1>Home</h1>
    </>
  )
}

/* 
since nextjs uses pre-rendering, so it's optimized to be indexed in google (the google bots, crawlers
will get the page with content)

Application flow:

Stripe (payment, has a very helpful API), subscription ->

Github OAuth authentication ->

FaunaDB (this database works very well with serverless applications, like Nextjs),
other example is DynamoDB, in the DB will be stored subscription data of the user -> 

Prismic CMS - Content managament system - manage the content of a application,
serve the content of the website (a blog for example) through an API.

serverless - each route in our application will be executed in a isolated environment. Instead of the resource
being served all the time by the programmer, the cloud provider will instaciate a virtual machine to 
serve that resource in a scalable way, all this is handled by the cloud provider, like AWS, Azure, Google Cloud.
s

*/

export default Home
