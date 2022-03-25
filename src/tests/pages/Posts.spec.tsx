import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { stripe } from '../../services/stripe'
import { createClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'a-post',
    title: 'A post',
    summary: 'Post summary',
    updatedAt: '03-25-2022',
  },
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('A post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const createClientMocked = jest.mocked(createClient)

    createClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'a-post',
            data: {
              title: [{ type: 'heading', text: 'A post' }],
              content: [{ type: 'paragraph', text: 'Post summary' }],
            },
            last_publication_date: '03-25-2022',
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'a-post',
              title: 'A post',
              summary: 'Post summary',
              updatedAt: '25 de março de 2022',
            },
          ],
        },
      })
    )
  })
})
