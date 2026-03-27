import baseConfig from "../config.json"
import Config from "./types/config"

const config: Config = {
    name: process.env.APP_NAME ?? baseConfig.name,

    host: process.env.HOST ?? baseConfig.host,

    port: process.env.PORT
        ? Number(process.env.PORT)
        : baseConfig.port,

    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW
            ? Number(process.env.RATE_LIMIT_WINDOW)
            : baseConfig.rateLimit.windowMs,

        max: process.env.RATE_LIMIT_MAX
            ? Number(process.env.RATE_LIMIT_MAX)
            : baseConfig.rateLimit.max
    },

    logging: process.env.LOGGING
        ? process.env.LOGGING === "true"
        : baseConfig.logging,

    theme: process.env.THEME ?? baseConfig.theme,

    storage: {
        ...baseConfig.storage
    }
}

export default config