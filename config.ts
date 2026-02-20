import Config from "./src/types/config"

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
        type: 'file', // 'file' or 'redis'
        file: {
            directory: 'data' // Directory to store files, will be created if it doesn't exist
        },
        //timeout: 365 * 24 * 60 * 60 * 1000 // Optional timeout for entries in milliseconds (e.g. 1 day = 24 * 60 * 60 * 1000). If set, entries will be automatically deleted after the specified time. Note: For file storage, this will check for expired entries on each save and read operation, which may impact performance if you have a large number of files.
        //redis: {
        //     connectionString: 'redis://localhost:6379' // Redis connection string
        //}
    }
}

export default config