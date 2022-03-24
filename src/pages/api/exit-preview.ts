import { exitPreview } from '@prismicio/next'

export default async function exit(req, res) {
  console.log('ESTOU NO EXIT-PREVIEW')
  await exitPreview({ req, res })
}
