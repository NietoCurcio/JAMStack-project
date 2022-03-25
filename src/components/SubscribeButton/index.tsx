import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe_js'
import styles from './styles.module.scss'

export function SubscribeButton() {
  const { data } = useSession()
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!data) {
      signIn()
      return
    }

    if (data.activeSubscription) {
      router.push('/posts')
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
