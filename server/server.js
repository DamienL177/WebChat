import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
/*
let newUser = await prisma.user.create({
  data: {
    username: 'test',
    password: 'Test',
    token: ""
  },
})*/

function encrypt(text){
  let cryptedText = "";
  for (let i = 0; i < text.length; i ++){
    let intChar = text.charCodeAt(i);
    intChar = intChar ** 29;
    intChar = intChar % 187;
    cryptedText += String.fromCharCode(intChar);
  }
  return cryptedText;
}

function decrypt(text){
  let uncryptedText = "";
  for (let i = 0; i < text.length; i ++){
    let intChar = text.charCodeAt(i);
    intChar = intChar ** 149;
    intChar = intChar % 187;
    uncryptedText += String.fromCharCode(intChar);
  }
  return uncryptedText;
  
}

async function checkToken(content){
  const user = await prisma.User.findFirst({
    where : {
      username : content.username,
      token : content.token
    }
  });
  if (user != null && content.token != null){
    let valToken = decrypt(content.token);
    let listTokenInfos = valToken.split("@");
    if (listTokenInfos.length == 2){
      let timeSinceCreation = Date.now() - parseInt(listTokenInfos[1]);
      if (timeSinceCreation <= 7200000){
        return true;
      }
    }
  } 
  return false; 
}

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

  socket.on('connectionAttempt', async (content) => {
    const user = await prisma.User.findFirst({
      where : {
        username : content.username,
        password : content.password
      }
    });
    if (user != null){
      let valToken = user.username + ":" + user.id + "@" + toString(Date.now());
      valToken = encrypt(valToken);
      const updateUser = await prisma.User.update({
        where : {
          id : user.id
        },
        data : {
          token : valToken
        }
      })
      socket.emit('connectionSuccess', {username : user.username, token : valToken})
    }
    else {
      socket.emit('connectionFail');
    }
  })

  socket.on('tokenConnection', async (content) => {
    if (checkToken(content)){
      socket.emit("tokenOK");
    }
    else {
      socket.emit("tokenFail");
    }
  })

  socket.on('message', (content) => {
    //console.log(content.user + " sent " + content.message)
    if (checkToken(content)){
      socket.broadcast.emit('message', {sender : content.username,message : content.message})
    }
    else {
      socket.emit("tokenFail");
    }
  })

  socket.on('disconnect', () => {
    //console.log("A user disconnected")
  })

  socket.on('logupAttempt', async (content) => {
    const user = await prisma.User.findFirst({
      where : {
        username : content.username,
      }
    });
    if (user == null){
      let newUser = await prisma.user.create({
        data: {
          username: content.username,
          password: content.password,
          token: ""
        },
      })
      socket.emit("logupSuccess");
    }
    else {
      socket.emit("logupFailed", {error : "This username already exists"});
    }
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
