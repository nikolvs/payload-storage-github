import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { Octokit } from 'octokit'

import path from 'node:path'

import type { GithubAuthor } from './types'

import { getFileSHA } from './utilities'

interface Args {
  author?: GithubAuthor
  branch: string
  committer?: GithubAuthor
  getStorageClient: () => Octokit
  owner: string
  repo: string
}

export const getHandleDelete = ({
  author,
  branch,
  committer,
  getStorageClient,
  owner,
  repo,
}: Args): HandleDelete => {
  return async ({ doc, filename }) => {
    const prefix = doc.prefix || ''
    const sha = await getFileSHA(getStorageClient, owner, repo, branch, prefix, filename)

    await getStorageClient().rest.repos.deleteFile({
      author,
      branch,
      committer,
      message: `:x: Delete "${filename}"`,
      owner,
      path: path.posix.join(prefix, filename),
      repo,
      sha,
    })
  }
}
