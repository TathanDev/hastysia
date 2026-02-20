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
    storage:StorageConfig 

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

type DeletionConfig = {
    timeout: number | null
}

type StorageConfig = RedisConfig & DeletionConfig | FileConfig & DeletionConfig;

export default Config;