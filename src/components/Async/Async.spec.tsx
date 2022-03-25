import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Async } from '.'

test('it renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Hello world')).toBeInTheDocument()
  /*
  expect(
    await screen.findByText('Button', {}, { timeout: 5000 })
  ).toBeInTheDocument()
  this is not appropriate
  */

  await waitForElementToBeRemoved(screen.queryByText('Button invisible'))

  await waitFor(() => {
    return expect(screen.getByText('Button')).toBeInTheDocument()
  })

  /*
  getBy search element and do not wait, throw error
  find  search element and will "wait" (spec), throw error
  query esarch element, do not throw error
  */
})
