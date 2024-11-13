import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { GithubAuthor } from './types'

import { Octokit } from 'octokit'
import path from 'node:path'

import { getFileSHA } from './utilities'

interface Args {
  owner: string
  repo: string
  branch: string
  prefix?: string
  committer?: GithubAuthor
  author?: GithubAuthor
  getStorageClient: () => Octokit
}

export const getHandleUpload = ({
  getStorageClient,
  committer,
  author,
  owner,
  repo,
  branch,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const sha = await getFileSHA(getStorageClient, owner, repo, branch, prefix, file.filename)

    await getStorageClient().rest.repos.createOrUpdateFileContents({
      committer,
      author,
      owner,
      repo,
      branch,
      sha,
      path: path.posix.join(data.prefix || prefix, file.filename),
      content: file.buffer.toString('base64'),
      message: data.commitMessage || `:arrow_up_small: Upload "${file.filename}"`,
    })
  }
}
