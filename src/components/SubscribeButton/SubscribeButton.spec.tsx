import { render, screen, fireEvent } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/react'
import { SubscribeButton } from '.'
import { useRouter } from 'next/router'

jest.mock('next-auth/react', () => {
  return {
    signIn: jest.fn(),
    // useSession without jest.fn would get an error because
    // we are mocking it in a specific test as well
    useSession: jest.fn(() => {
      return {
        data: null,
        status: 'unauthenticated',
      }
    }),
  }
})

jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = jest.mocked(signIn)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)
    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { email: 'johndoe@gmail.com', name: 'John Doe' },
        expires: 'mock-expires',
        activeSubscription: 'fake-active',
      },
      status: 'authenticated',
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
