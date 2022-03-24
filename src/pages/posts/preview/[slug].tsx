import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { createClient } from '../../../services/prismic'
import * as prismicH from '@prismicio/helpers'
import Head from 'next/head'

import styles from '../post.module.scss'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (data?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [data])

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?{' '}
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/*
static pages aren't protected, since it's static content (it's public)

ssr pre-render on request time, so it can parse the request
and pre-render a page that requires access control
*/

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // paths: [{ params: { slug: 'por-que-o-facebook-meta-criou-o-graphql' } }],
    // at build build Next.js will generate /posts/preview/por-que-o-facebook-meta-criou-o-graphql static page

    paths: [],
    fallback: 'blocking',

    /*
    https://nextjs.org/learn/basics/dynamic-routes/dynamic-routes-details

    fallback: true - the page that has not been generated statically will be rendered client-side, 
    subsequents requests will make use of the static page generetated by Next.js in the background

    fallback: false - returns a 404 page

    fallback: 'blocking' - it's like fallback true, but it will pre-render with SSR,
    instead of client-side, better for SEO than fallback true
    */
  }
}

// public content can be static
export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}) => {
  const { slug } = params

  const client = createClient({
    previewData,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  })

  const response = await client.getByUID('post', slug.toString(), {})

  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: prismicH.asHTML(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      { day: '2-digit', month: 'long', year: 'numeric' }
    ),
  }

  return {
    props: { post },
    revalidate: 60 * 30, // 30 minutes
  }
}
