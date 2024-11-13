import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import path from 'node:path'

interface Args {
  branch: string
  owner: string
  repo: string
}

export const getGenerateURL = ({ branch, owner, repo }: Args): GenerateURL => {
  return ({ filename, prefix = '' }) => {
    return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${path.posix.join(prefix, filename)}`
  }
}
