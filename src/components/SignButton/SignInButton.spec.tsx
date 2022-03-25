import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('renders correctly when user not authenticated', () => {
    // const useSessionMocked = useSession as jest.Mock
    const useSessionMocked = jest.mocked(useSession)
    // https://github.com/facebook/jest/pull/12089
    // https://jestjs.io/docs/jest-object#jestmockedtitem-t-deep--false
    // https://kulshekhar.github.io/ts-jest/docs/guides/test-helpers

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('renders correctly when user is authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { email: 'johndoe@gmail.com', name: 'John Doe' },
        expires: 'mock-expires',
      },
      status: 'authenticated',
    })

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
