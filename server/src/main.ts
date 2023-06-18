import './core/config/index.js'

import http from 'node:http'

import { Server } from 'socket.io'

import { app } from './app.js'

const PORT = process.env.PORT

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
})

io.on('connection', console.log)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
