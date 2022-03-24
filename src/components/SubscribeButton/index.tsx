import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe_js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data } = useSession()
  const { push } = useRouter()

  const handleSubscribe = async () => {
    if (!data) {
      signIn()
      return
    }

    if (data.activeSubscription) {
      push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      /*
      docs
      https://stripe.com/docs/js/checkout
      https://stripe.com/docs/stripe-js/react
      */

      stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <button className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  )
}
