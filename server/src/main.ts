import './core/config/index.js'

import http from 'node:http'

import { Server } from 'socket.io'

import { app } from './app.js'

const PORT = process.env.PORT

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
    credentials: true,
  },
})

io.on('connection', socket => {
  console.log('a user connected', socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
