import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})

describe('ActiveLink component', () => {
  it('renders correctly', () => {
    render(
      <ActiveLink href="/" activeClassName="ative">
        <a>Home</a>
      </ActiveLink>
    )

    // debug()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('receives active class when link is active', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})
