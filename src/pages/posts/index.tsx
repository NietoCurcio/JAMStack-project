import Head from 'next/head'
import styles from './styles.module.scss'
import { createClient } from '../../services/prismic'
import { GetStaticProps } from 'next'
import * as prismic from '@prismicio/client'
import * as prismicH from '@prismicio/helpers'
import Link from 'next/link'

type Post = {
  slug: string
  title: string
  summary: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.summary}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({
    previewData,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  })

  const response = await client.getByType('post')
  /*
  or using client.get
  const pages2 = await client.get({
    predicates: [prismic.predicate.at('document.type', 'post')],
  })
  */

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: prismicH.asText(post.data.title),
      summary:
        post.data.content.find(
          (content) => content.type === 'paragraph' && content.text !== ''
        )?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        { day: '2-digit', month: 'long', year: 'numeric' }
      ),
    }
  })

  return {
    props: { posts },
  }
}
