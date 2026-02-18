export type Config = {
    host: string
    port: number
    rateLimit: {
        windowMs: number 
        max: number
    }
}

const config: Config = {
    host: 'localhost',
    port: 3000,
    rateLimit: {
        windowMs: 10_000,
        max: 5
    }
}

export default config