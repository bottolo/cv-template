import app from './app.ts'

const server= Bun.serve({
    port: process.env.PORT || 3000,
    fetch: app.fetch
})

console.log("Server started at", server.port);
