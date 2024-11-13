import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { GithubAuthor } from './types'

import { Octokit } from 'octokit'
import path from 'node:path'

import { getFileSHA } from './utilities'

interface Args {
  owner: string
  repo: string
  branch: string
  committer?: GithubAuthor
  author?: GithubAuthor
  getStorageClient: () => Octokit
}

export const getHandleDelete = ({
  getStorageClient,
  committer,
  author,
  owner,
  repo,
  branch,
}: Args): HandleDelete => {
  return async ({ doc: { prefix = '' }, filename }) => {
    const sha = await getFileSHA(getStorageClient, owner, repo, branch, prefix, filename)

    await getStorageClient().rest.repos.deleteFile({
      committer,
      author,
      owner,
      repo,
      branch,
      sha,
      path: path.posix.join(prefix, filename),
      message: `:x: Delete "${filename}"`,
    })
  }
}
