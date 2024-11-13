import type { CollectionOptions } from '@payloadcms/plugin-cloud-storage/types'
import { Octokit } from 'octokit'

type OctokitOptions = ConstructorParameters<typeof Octokit>[0]

export interface GithubStorageOptions {
  /**
   * The name of the repository owner (GitHub username or organization).
   */
  owner: string

  /**
   * The repository name.
   */
  repo: string

  /**
   * Which branch to upload/read files.
   *
   * Default: "main"
   */
  branch?: string

  /**
   * Collection options to apply the GitHub adapter to.
   */
  collections: Record<string, Omit<CollectionOptions, 'adapter'> | true>

  /**
   * Whether or not to enable the plugin.
   *
   * Default: true
   */
  enabled?: boolean

  /**
   * Octokit client configuration.
   *
   * @see https://github.com/octokit/octokit.js
   */
  options: OctokitOptions
}

export interface GithubAuthor {
  name: string
  email: string
  date?: string
}
