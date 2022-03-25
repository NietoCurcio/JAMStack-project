import { useEffect, useState } from 'react'

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isButtonInVisible, setIsButtonInVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true)
    }, 1000)
    setTimeout(() => {
      setIsButtonInVisible(true)
    }, 1000)
  }, [])

  return (
    <div>
      <p>Hello world</p>
      {isButtonVisible && <button>Button</button>}
      {!isButtonInVisible && <button>Button invisible</button>}
    </div>
  )
}
