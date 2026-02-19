export type Config = {
    name: string
    host: string
    port: number
    rateLimit: {
        windowMs: number
        max: number
    }
    logging: boolean
    theme: string
    storage:
    | RedisConfig
    | FileConfig

}

type RedisConfig = {
    type: 'redis'
    redis: {
        connectionString: string
    }
};

type FileConfig = {
    type: 'file'
    file: {
        directory: string
    }
};

export default Config;