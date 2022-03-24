import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { getSession } from 'next-auth/react'
import { createClient } from '../../services/prismic'
import * as prismicH from '@prismicio/helpers'
import Head from 'next/head'

import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
}

/*
static pages aren't protected, since it's static content

ssr pre-render on request time, so it can parse the request
and pre-render a page that requires access control
*/

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  previewData,
}) => {
  const session = await getSession({ req })
  const { slug } = params // since it's [slug].tsx, and not [...slug].tsx, it won't be an array

  if (!session.activeSubscription) {
    return {
      redirect: { destination: '/', permanent: false },
    }
  }

  const client = createClient({
    previewData,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  })

  const response = await client.getByUID('post', slug.toString(), {})

  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: prismicH.asHTML(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      { day: '2-digit', month: 'long', year: 'numeric' }
    ),
  }

  return {
    props: { post },
  }
}
