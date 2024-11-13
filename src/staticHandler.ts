import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { Octokit } from 'octokit'
import type { CollectionConfig } from 'payload'

import path from 'node:path'
import { RequestError } from 'octokit'

import { getFileProperties } from './utilities'

interface Args {
  branch: string
  collection: CollectionConfig
  getStorageClient: () => Octokit
  owner: string
  repo: string
}

export const getStaticHandler = ({
  branch,
  collection,
  getStorageClient,
  owner,
  repo,
}: Args): StaticHandler => {
  return async (req, { params: { filename } }) => {
    try {
      const { mimeType, prefix } = await getFileProperties({ collection, filename, req })
      const { data, headers } = await getStorageClient().rest.repos.getContent({
        owner,
        path: path.posix.join(prefix, filename),
        ref: branch,
        repo,
      })

      const bodyBuffer = 'content' in data ? Buffer.from(data.content, 'base64') : ''

      return new Response(bodyBuffer, {
        headers: new Headers({
          'Content-Type': mimeType || 'application/octet-stream',
          ...('size' in data && {
            'Content-Length': String(data.size),
          }),
          ...('etag' in headers && {
            ETag: headers.etag,
          }),
        }),
        status: 200,
      })
    } catch (err: unknown) {
      if (err instanceof RequestError && err.status === 404) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      req.payload.logger.error({ err, msg: 'Unexpected error in staticHandler' })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
