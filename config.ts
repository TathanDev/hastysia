type Config = {
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
        | {
            type: 'file'
            file: {
                directory: string
            }
        }
        | {
            type: 'redis'
            redis: {
                connectionString: string
            }
        }
}

const config: Config = {
    
    name: "Elysia Haste", // Site name, you can change it to whatever you want
    host: 'localhost', // Host to bind the server to
    port: 7777, // Port to bind the server to
    rateLimit: {
        windowMs: 10_000,
        max: 50
    },
    logging: true, // Enable or disable logging
    theme: 'atom-one-dark', // Check available themes at https://highlightjs.org/examples
    storage: {
        type: 'redis', // 'file' or 'redis'
        //file: {
        //    directory: 'data' // Directory to store files, will be created if it doesn't exist
        //},
        redis: {
             connectionString: 'redis://localhost:6379' // Redis connection string
        }
    }
}

export default config