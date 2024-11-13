import type { CollectionConfig, PayloadRequest, UploadConfig } from 'payload'

import { Octokit, RequestError } from 'octokit'
import path from 'node:path'

/**
 * Get the SHA of a GitHub file.
 */
export const getFileSHA = async (
  getStorageClient: () => Octokit,
  owner: string,
  repo: string,
  branch: string,
  prefix: string,
  filename: string,
) => {
  try {
    const response = await getStorageClient().rest.repos.getContent({
      owner,
      repo,
      ref: branch,
      path: path.posix.join(prefix, filename),
    })

    return 'sha' in response.data ? response.data.sha : ''
  } catch (err: unknown) {
    if (err instanceof RequestError && err.status === 404) {
      return ''
    }

    throw err
  }
}

/**
 * Get the file properties from a collection.
 */
export async function getFileProperties({
  collection,
  filename,
  req,
}: {
  collection: CollectionConfig
  filename: string
  req: PayloadRequest
}): Promise<{ prefix: string; mimeType: string }> {
  const imageSizes = (collection?.upload as UploadConfig)?.imageSizes || []
  const files = await req.payload.find({
    collection: collection.slug,
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      or: [
        {
          filename: { equals: filename },
        },
        ...imageSizes.map((imageSize) => ({
          [`sizes.${imageSize.name}.filename`]: { equals: filename },
        })),
      ],
    },
  })

  const [doc] = files?.docs

  return {
    prefix: doc && 'prefix' in doc ? (doc.prefix as string) : '',
    mimeType: doc && 'mimeType' in doc ? (doc.mimeType as string) : '',
  }
}
