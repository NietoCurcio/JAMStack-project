import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'

jest.mock('next/router')
jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return {
        data: null,
        status: 'unauthenticated',
      }
    },
  }
})
jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: '$10.00' }} />)

    expect(screen.getByText(/\$10.00/)).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    // objectContaining can be a subset of the received object
    // https://jestjs.io/docs/expect#expectobjectcontainingobject
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00',
          },
        },
      })
    )
  })
})
