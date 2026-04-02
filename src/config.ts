import baseConfig from "../config.json"
import Config from "./types/config"

const envStorageType = process.env.STORAGE_TYPE?.toLowerCase()
const storageType = envStorageType === "redis" || envStorageType === "file"
    ? envStorageType
    : baseConfig.storage.type

const storage = storageType === "redis"
    ? {
        ...baseConfig.storage,
        type: "redis" as const,
        redis: {
            connectionString: process.env.REDIS_CONNECTION_STRING ?? baseConfig.storage.redis.connectionString
        },
        timeout: process.env.STORAGE_TIMEOUT ? Number(process.env.STORAGE_TIMEOUT)
            : baseConfig.storage.timeout
    }
    : {
        ...baseConfig.storage,
        type: "file" as const,
        file: {
            directory: process.env.DATA_DIRECTORY ?? baseConfig.storage.file.directory
        },
        timeout: process.env.STORAGE_TIMEOUT ? Number(process.env.STORAGE_TIMEOUT)
            : baseConfig.storage.timeout
    }

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

    storage
}

export default config