import { render, screen } from '@testing-library/react'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { createClient } from '../../services/prismic'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const post = {
  slug: 'a-post',
  title: 'A post',
  content: '<p>Post content</p>',
  updatedAt: '03-25-2022',
}

jest.mock('../../services/prismic')
jest.mock('next-auth/react')
jest.mock('next/router')

describe('PostPreview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render(<PostPreview post={post} />)

    expect(screen.getByText('A post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post if subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'active',
      },
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    render(<PostPreview post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/a-post')
  })

  it('loads initial data', async () => {
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

    const response = await getStaticProps({
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
