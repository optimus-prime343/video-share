import { io } from 'socket.io-client'

const socketURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export const socket = io(socketURL, {
  withCredentials: true,
})
