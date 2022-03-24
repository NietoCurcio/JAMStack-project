import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import sm from '../../sm.json'

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  console.log('Hellllllllllo')
  console.log(doc)
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
      return `/posts/${doc.uid}`
    default:
      return null
  }
}

interface configProps {
  accessToken?: string
  previewData?: any
  req?: any
}

// This factory function allows smooth preview setup
export function createClient(config: configProps) {
  const client = prismic.createClient(endpoint, {
    ...config,
  })

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}
