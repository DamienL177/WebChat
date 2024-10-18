import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const app = express()
const server = new http.Server(app)
const io = new Server(server, {
    cors: {
        origin : "http://localhost:5173",
        methods : ["GET", "POST"],
        credentials : true
    }
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

io.on('connection', (socket) => {
  //console.log("A user connected")

  socket.on('message', (content) => {
    //console.log(content.user + " sent " + content.message)
    socket.broadcast.emit('message', content) 
  })

  socket.on('disconnect', () => {
    //console.log("A user disconnected")
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
