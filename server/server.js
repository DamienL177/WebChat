import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'
import { hash } from 'crypto'

const prisma = new PrismaClient()
/*
let newUser = await prisma.user.create({
  data: {
    username: 'test',
    password: 'Test',
    token: ""
  },
})*/

const n = 3233;
const e = 17;
const d = 2753;

function encrypt(text) {
  let cryptedText = "";
  for (let i = 0; i < text.length; i++) {
    let intChar = text.charCodeAt(i);

    // Exponentiation modulaire rapide
    let encryptedChar = 1;
    for (let j = 0; j < e; j++) {
      encryptedChar = (encryptedChar * intChar) % n;
    }
    cryptedText += intChar + ";";
  }
  return cryptedText;
}

function decrypt(text) {
  let uncryptedText = "";
  let listValsToken = text.split(";");
  for (let i = 0; i < listValsToken.length - 1; i++) {
    let intChar = parseInt(listValsToken[i]);

    // Exponentiation modulaire rapide
    let encryptedChar = 1;
    for (let j = 0; j < d; j++) {
      encryptedChar = (encryptedChar * intChar) % n;
    }
    //console.log(intChar);
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
    //console.log("A");
    let valToken = decrypt(content.token);
    //console.log("decrypted : " + valToken);
    let listTokenInfos = valToken.split("@");
    //console.log(listTokenInfos);
    if (listTokenInfos.length == 2){
      //console.log("B");
      let timeSinceCreation = Date.now() - parseInt(listTokenInfos[1]);
      if (timeSinceCreation <= 7200000){
        //console.log("C");
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
      }
    });
    if (user != null){
      let password = decrypt(content.password);
      if (password != null){
        let saltRounds = 3
        if (await bcrypt.compare(password, user.password)){
          let valToken = user.username + ":" + user.id + "@" + Date.now().toString();
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
          socket.emit('connectionFail', {error : "Incorrect username or password."});
        }
      }
      else {
        socket.emit('connectionFail', {error : "No password found"});
      }
    }
    else {
      socket.emit('connectionFail', {error : "Incorrect username or password."});
    }
  })

  socket.on('tokenConnection', async (content) => {
    if (await checkToken(content)){
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
      let password = decrypt(content.password);
      if (password != null){
        let saltRounds = 3
        let hashedPWD = await bcrypt.hash(password, saltRounds)
        let newUser = await prisma.user.create({
          data: {
            username: content.username,
            password: hashedPWD,
            token: ""
          },
        })
        socket.emit("logupSuccess");
      }
      else {
        socket.emit('logupFailed', {error : "No password found"});
      }
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
