import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'
import { hash } from 'crypto'

const prisma = new PrismaClient()

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

// TODO : what if all rooms occupied?
async function calculerCode() {
  let codeOk = false;
  let codeFinal = "";
  while (!codeOk){
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomArray = Array.from({ length: 6 }, () => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    });
    let code = randomArray.join('');
    let oldRoom = await prisma.room.findFirst({
      where : {
        code : code
      }
    })
    if (oldRoom == null){
      codeOk = true;
      codeFinal = code;
    }
  }
  return codeFinal;
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
  socket.join("general");

  socket.on('connectionAttempt', async (content) => {
    const user = await prisma.User.findFirst({
      where : {
        username : content.username,
      }
    });
    if (user != null){
      let password = decrypt(content.password);
      if (password != null){
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

  socket.on("joinRoom", async (content) => {
    socket.leave("general");
    socket.join(content.code);
    let roomHistory = [];
    const currentUser = await prisma.User.findFirst({
      where : {
        username : content.username,
      }
    });
    const room = await prisma.room.findFirst({
      where : {
        code : content.code
      },
      include: { 
        messages: {
          orderBy : {
            date : "desc"
          },
          take : 25
        } 
      }
    });
    if (room != null){
      if (room.messages != undefined){
        for (const message of room.messages) {
          const user = await prisma.user.findFirst({
            where: {
              id: message.userId,
            },
          });
          let messageSent = {};
          if (currentUser.id == user.id) {
            messageSent["currentUser"] = true;
          } else {
            messageSent["currentUser"] = false;
          }
          messageSent["message"] = message.content;
          messageSent["username"] = user.username;
          roomHistory.push(messageSent);
        }
      }
    }
    roomHistory.reverse();
    socket.emit("roomJoined", {roomHistory : roomHistory, roomCode : content.code});
  })

  socket.on("leaveRoom", (content) => {
    socket.leave(content.code);
    socket.join("general");
  })

  socket.on('tokenConnection', async (content) => {
    if (await checkToken(content)){
      socket.emit("tokenOK");
    }
    else {
      socket.emit("tokenFail");
    }
  })

  socket.on('message', async (content) => {
    //console.log(content.user + " sent " + content.message)
    if (checkToken(content) && content.room != null && content.room != ""){
      socket.broadcast.to(content.room).emit('message', {sender : content.username,message : content.message})
      //console.log(content.room);
      const room = await prisma.room.findFirst({
        where : {
          code : content.room
        }
      })
      //console.log(room);
      if (room != null){
        let user = await prisma.User.findFirst({
          where : {
            username : content.username,
          }
        });
        if (user != null){
          //console.log(user);
          let newMessage = await prisma.message.create({
            data: {
              date : Date.now().toString(),
              content : content.message,
              userId : user.id,
              roomId : room.id
            },
          })
        }
      }
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

  socket.on('roomCreationAsk', async (content) => {
    if (checkToken(content)){
      let code = await calculerCode();
      socket.emit("roomCode", {code : code});
    }
    else {
      socket.emit("tokenFail");
    }
  })

  socket.on('roomKnown', async (content) => {
    if (checkToken(content)){
      const user = await prisma.User.findFirst({
        where : {
          username : content.username
        },
        include: { rooms: true }
      });
      if (user != null){
        if (user.rooms != undefined){
          user.rooms.forEach((room) => {
            let creator = false;
            if (room.userId == user.id){
              creator = true;
            }
            socket.emit("roomAccessible", {name : room.name, code : room.code, creator : creator})
          })
        }
      }
      else {
        socket.emit('error', {error : "Unreckognized user."});
      }
    }
    else {
      socket.emit("tokenFail");
    }
  })

  socket.on('roomCreation', async (content) => {
    if (checkToken(content)){
      const user = await prisma.User.findFirst({
        where : {
          username : content.username,
        }
      });
      if (user != null){
        if (content.code != null && content.code != ""){
          let oldRoom = await prisma.room.findFirst({
            where : {
              code : content.code
            }
          })
          if (oldRoom == null){
            if (content.name != null && content.name != "" && content.password != null && content.password != ""){
              let pwd = decrypt(content.password);
              let saltRounds = 3
              let hashedPWD = await bcrypt.hash(pwd, saltRounds)
              let newRoom = await prisma.room.create({
                data: {
                  name : content.name,
                  code : content.code,
                  password : hashedPWD,
                  userId : user.id,
                  users : {
                    connect: { id: user.id } // Connecte la room à l'utilisateur existant
                  }
                },
              })
              socket.emit("roomAccessible", {name : content.name, code : content.code, creator : true})
            }
            else {
              socket.emit("Error");
            }
          }
          else {
            socket.emit("Error");
          }
        }
        else {
          // TODO : what to do on error
          socket.emit("Error");
        }
      }
      else {
        socket.emit("tokenFail");
      }
    }
    else {
      socket.emit("tokenFail");
    }
  })

  socket.on('logToRoom', async (content) => {
    if (checkToken(content)){
      const user = await prisma.User.findFirst({
        where : {
          username : content.username,
        }
      });
      if (user != null){
        let room = await prisma.room.findFirst({
          where : {
            code : content.code
          }
        })
        if (room != null && await bcrypt.compare(decrypt(content.password), room.password)){
          // TODO : add verification if user already knows the room
          let updateRoom = await prisma.room.update({
            where: { id : room.id }, // Identifier la Room
            data: {
              users: {
                connect: { id: user.id }, // Associer un nouvel User à la Room
              },
            },
            include: { users: true },
          })
          socket.emit("roomAccessible", {name : room.name, code : room.code, creator : false})
        }
        else {
          // TODO : add error here
        }
      }
      else {
        socket.emit("tokenFail");
      }
    }
    else {
      socket.emit("tokenFail");
    }
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
