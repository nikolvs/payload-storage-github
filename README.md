# GitHub Storage for Payload

This package provides a way to use the [GitHub REST API](https://docs.github.com/en/rest) to store files with Payload.

## Installation

```sh
pnpm add payload-storage-github
```

## Usage

- Configure the `collections` object to specify which collections should use the GitHub Storage adapter. The slug _must_ match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.

```ts
import { githubStorage } from 'payload-github-storage'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    githubStorage({
      collections: {
        [mediaSlug]: true,
        [mediaWithPrefixSlug]: {
          prefix: '/media',
        },
      },

      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY_NAME,
      branch: process.env.GITHUB_REPOSITORY_BRANCH,

      options: {
        auth: process.env.GITHUB_ACCESS_TOKEN,
      },
    }),
  ],
})
```

### Configuration Options

| Option        | Description                                                                                         | Default   |
| ------------- | --------------------------------------------------------------------------------------------------- | --------- |
| `enabled`     | Whether or not to enable the plugin                                                                 | `true`    |
| `collections` | Collections to apply the storage to                                                                 |           |
| `owner`       | The name of the repository owner (GitHub username or organization)                                  |           |
| `repo`        | The repository name                                                                                 |           |
| `branch`      | Which branch to upload/read files                                                                   | `"main"`  |
| `options`     | Octokit client configuration. See [Docs](https://github.com/octokit/octokit.js)                     |           |
