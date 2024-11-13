import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
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
  prefix?: string
  repo: string
}

export const getHandleUpload = ({
  author,
  branch,
  committer,
  getStorageClient,
  owner,
  prefix = '',
  repo,
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const sha = await getFileSHA(getStorageClient, owner, repo, branch, prefix, file.filename)

    await getStorageClient().rest.repos.createOrUpdateFileContents({
      author,
      branch,
      committer,
      content: file.buffer.toString('base64'),
      message: data.commitMessage || `:arrow_up_small: Upload "${file.filename}"`,
      owner,
      path: path.posix.join(data.prefix || prefix, file.filename),
      repo,
      sha,
    })
  }
}
