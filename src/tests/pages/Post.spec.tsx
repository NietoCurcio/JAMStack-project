import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { createClient } from '../../services/prismic'
import { getSession } from 'next-auth/react'

const post = {
  slug: 'a-post',
  title: 'A post',
  content: '<p>Post content</p>',
  updatedAt: '03-25-2022',
}

jest.mock('../../services/prismic')
jest.mock('next-auth/react')

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('A post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
  })

  it('redirects user if not subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession)
    const slug = 'a-post'

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug,
      },
    } as any)

    // first verify if contains the redirect property
    // then verify if redirect contains destination property
    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: `/posts/preview/${slug}`,
        }),
      })
    )
  })

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

    const createClientMocked = jest.mocked(createClient)

    createClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading1',
              text: 'A post',
              spans: [],
            },
          ],
          content: [{ type: 'paragraph', text: 'Post content', spans: [] }],
        },
        last_publication_date: '03-25-2022',
      }),
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'a-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'a-post',
            title: 'A post',
            content: '<p>Post content</p>',
            updatedAt: '25 de março de 2022',
          },
        },
      })
    )
  })
})
