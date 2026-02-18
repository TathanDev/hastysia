const config = {
    
    name: "Elysia Haste", // Site name, you can change it to whatever you want
    host: 'localhost', // Host to bind the server to
    port: 7777, // Port to bind the server to
    rateLimit: {
        windowMs: 10_000,
        max: 50
    },
    theme: 'atom-one-dark' // Check available themes at https://highlightjs.org/examples

}

export default config