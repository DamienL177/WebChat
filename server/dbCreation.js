import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

let newUser = await prisma.user.create({
    data: {
        username: 'dev',
        password: '$2a$04$Vdlxb7RWhkuX25gcpD12eO7bMIT2O7gY8ZS6Fe8kPQIG91P59KJIC',
        token: ""
    },
})

let newRoom = await prisma.room.create({
    data: {
        name : "general",
        code : "general",
        password : "generalPWD",
        userId : 1,
        users : {
        }
    },
  })

console.log("Database Creation done.");