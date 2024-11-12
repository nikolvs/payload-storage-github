import type { Config } from 'payload'

import type { MyPluginOptions } from './types.js'

export const myPlugin =
  (_: MyPluginOptions) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }
    return config
  }
