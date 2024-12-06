/** Server for Chat Web Application
 *  
 *  author : Damien Lanusse
 *  last edit : december 5th, 2024
 */

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'
import { hash } from 'crypto'

// Database access
const prisma = new PrismaClient()

// RSA cryptosystem values
const n = 3233;
const e = 17;
const d = 2753;

// RSA encryption function
function encryption(text) {
	let cryptedText = "";
	for (let i = 0; i < text.length; i++) {
		let intChar = text.charCodeAt(i);
		let encryptedChar = 1;
		for (let j = 0; j < e; j++) {
			encryptedChar = (encryptedChar * intChar) % n;
		}
		cryptedText += intChar + ";";
	}
	return cryptedText;
}

// RSA decryption function
function decryption(text) {
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

// Verification of self-made token
async function checkToken(content) {
	const user = await prisma.User.findFirst({
		where: {
			username: content.username,
			token: content.token
		}
	});
	// if there is a user with both username and token
	if (user != null && content.token != null) {
		// we separate the informations stored in the token
		let valToken = decryption(content.token);
		let listTokenInfos = valToken.split("@");
		// if the number of informations stored in the token is correct
		if (listTokenInfos.length == 2) {
			// if the token was created less than two hours ago, the token is correct
			let timeSinceCreation = Date.now() - parseInt(listTokenInfos[1]);
			if (timeSinceCreation <= 7200000) {
				return true;
			}
		}
	}
	// the token is wrong/too old
	return false;
}

// Searching for a viable room code
// TODO : what if all rooms occupied?
async function codeSearch() {
	let codeOk = false;
	let codeFinal = "";
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	// while the randomly generated code isn't unique
	while (!codeOk) {
		// we create an array of 6 random characters among the list
		let randomArray = Array.from({ length: 6 }, () => {
			const randomIndex = Math.floor(Math.random() * characters.length);
			return characters[randomIndex];
		});
		// we join the array into one single string
		let code = randomArray.join('');
		let oldRoom = await prisma.room.findFirst({
			where: {
				code: code
			}
		})
		// if no room exists with this code, the code is validated
		if (oldRoom == null) {
			codeOk = true;
			codeFinal = code;
		}
	}
	return codeFinal;
}

// Get a room's last 25 messages
async function getRoomHistory(currentUser, code) {
	let roomHistory = [];

	// we get the room and the 25 last messages
	const room = await prisma.room.findFirst({
		where: {
			code: code
		},
		include: {
			messages: {
				orderBy: {
					date: "desc"
				},
				take: 25
			}
		}
	});

	// if the room exists and there are messages
	if (room != null && room.messages != undefined) {
		for (const message of room.messages) {
			// we get the user who sent the message
			const user = await prisma.user.findFirst({
				where: {
					id: message.userId,
				},
			});
			// we add the message to the room's history
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
	if (roomHistory.length == 0) {
		roomHistory = null;
	}
	else {
		// reversing the room history and telling the user they now has joined the room
		roomHistory.reverse();
	}
	return roomHistory;
}

// Creation of the server
const app = express()
const server = new http.Server(app)
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true
	}
})

app.post('/login', (req, res) => {
	// Logique d'authentification
	res.json({ message: 'OK' });
});
app.post('/logout', (req, res) => {
	// Logique d'authentification
	res.json({ message: 'OK' });
});
app.use(cors({
	origin: '*',
	credentials: true
}));

// When the server is contacted via websocket
io.on('connection', (socket) => {

	// By default, the user is in the room of code "general"
	socket.join("general");

	// ------------------------ LOG IN --------------------------
	// User is attempting to log in via (username, password)
	socket.on('logIn', async (content) => {
		// Checking to see if user exists
		const user = await prisma.user.findFirst({
			where: {
				username: content.username,
			}
		});
		if (user != null) {
			// comparing password with hashed one
			let password = decryption(content.password);
			if (password != null) {
				if (await bcrypt.compare(password, user.password)) {
					// creation of the self-made token
					let valToken = user.username + ":" + user.id + "@" + Date.now().toString();
					valToken = encryption(valToken);
					// update of the token field of the user
					const updateUser = await prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							token: valToken
						}
					})
					socket.emit('connectionSuccess', { username: user.username, token: valToken })
				}
				else {
					socket.emit('connectionFail', { error: "Incorrect username or password." });
				}
			}
			else {
				socket.emit('connectionFail', { error: "No password found" });
			}
		}
		else {
			socket.emit('connectionFail', { error: "Incorrect username or password." });
		}
	})

	// Verification of token
	socket.on('tokenVerification', async (content) => {
		if (await checkToken(content)) {
			// we collect the 25 last messages of the room
			// we get the current user to compare with who sent each message
			const currentUser = await prisma.user.findFirst({
				where: {
					username: content.username,
				}
			});

			let roomHistory = await getRoomHistory(currentUser, "general");
			socket.emit("tokenOK", { roomHistory: roomHistory });
		}
		else {
			socket.emit("tokenFail");
		}
	})

	// ------------------------ LOG UP --------------------------
	// User creates an account in the Database
	socket.on('logup', async (content) => {
		// if no user exists with this username
		const user = await prisma.user.findFirst({
			where: {
				username: content.username,
			}
		});
		if (user == null) {
			// we hash the password and create the user
			let password = decryption(content.password);
			if (password != null) {
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
				socket.emit('logupFailed', { error: "No password found" });
			}
		}
		else {
			socket.emit("logupFailed", { error: "This username already exists" });
		}
	})

	// ------------------------ ROOM ---------------------------- 
	// User wants to join a room known to them to talk
	socket.on("joinRoom", async (content) => {
		// by default the user is in the general room, so we leave this room and join the correct one
		socket.leave("general");
		socket.join(content.code);

		// we collect the 25 last messages of the room
		// we get the current user to compare with who sent each message
		const currentUser = await prisma.user.findFirst({
			where: {
				username: content.username,
			}
		});

		let roomHistory = await getRoomHistory(currentUser, content.code);
		socket.emit("roomJoined", { roomHistory: roomHistory, roomCode: content.code });
	})

	// User wants to have a new code for their room
	socket.on('getNewRoomCode', async (content) => {
		if (checkToken(content)) {
			let code = await codeSearch();
			socket.emit("roomCode", { code: code });
		}
		else {
			socket.emit("tokenFail");
		}
	})

	// User wants to add a new room to the Database
	socket.on('createNewRoom', async (content) => {
		if (checkToken(content)) {
			// we get the current user
			const user = await prisma.user.findFirst({
				where: {
					username: content.username,
				}
			});
			if (user != null && content.code != null && content.code != "" && content.name != null
				&& content.name != "" && content.password != null && content.password != "") {
				// we check if there is already a room with this code
				let oldRoom = await prisma.room.findFirst({
					where: {
						code: content.code
					}
				})
				if (oldRoom == null) {
					// we hash the password of the room and create it
					let pwd = decryption(content.password);
					let saltRounds = 3
					let hashedPWD = await bcrypt.hash(pwd, saltRounds)
					let newRoom = await prisma.room.create({
						data: {
							name: content.name,
							code: content.code,
							password: hashedPWD,
							userId: user.id,
							users: {
								connect: { id: user.id } // Connecte la room à l'utilisateur existant
							}
						},
					})
					// announcing to the user that this room is ready
					socket.emit("roomAccessible", { name: content.name, code: content.code, creator: true })
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
			socket.emit("tokenFail");
		}
	})

	// User wants the list of rooms accessible to them
	socket.on('getListRooms', async (content) => {
		if (checkToken(content)) {
			// we get the user and their rooms
			const user = await prisma.user.findFirst({
				where: {
					username: content.username
				},
				include: { rooms: true }
			});
			if (user != null && user.rooms != undefined) {
				// for each room of the user, we tell them this room is available
				user.rooms.forEach((room) => {
					let creator = false;
					if (room.userId == user.id) {
						creator = true;
					}
					socket.emit("roomAccessible", { name: room.name, code: room.code, creator: creator })
				})
			}
			else {
				socket.emit('Error', { error: "Unreckognized user." });
			}
		}
		else {
			socket.emit("tokenFail");
		}
	})

	// User wants to access a new room
	socket.on('accessNewRoom', async (content) => {
		if (checkToken(content)) {
			// we get the user and their rooms
			const user = await prisma.user.findFirst({
				where: {
					username: content.username,
				},
				include: { rooms: true }
			});
			if (user != null) {

				// we make sure the user doesn't already have access to the room
				let access = false;
				if (user.rooms != undefined) {
					user.rooms.forEach(async (room) => {
						if (room.code == content.code) {
							access = true;
						}
					})
				}

				if (!access) {
					// we get the room from the database
					let room = await prisma.room.findFirst({
						where: {
							code: content.code
						}
					})
					// if we found the room and the password is correct
					if (room != null && await bcrypt.compare(decryption(content.password), room.password)) {
						// we update the connection between the room and the user
						let updateRoom = await prisma.room.update({
							where: { id: room.id }, // Identifier la Room
							data: {
								users: {
									connect: { id: user.id }, // Associer un nouvel User à la Room
								},
							},
							include: { users: true },
						})
						// we tell the user that this room is available, along with it's information
						socket.emit("roomAccessible", { name: room.name, code: room.code, creator: false })
					}
					else {
						socket.emit("Error");
					}
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

	// User wants to leave current room
	socket.on("leaveRoom", (content) => {
		socket.leave(content.code);
		socket.join("general");
	})

	// ------------------------------- MESSAGE -----------------------------
	// User sends a message
	socket.on('message', async (content) => {
		if (checkToken(content) && content.room != null && content.room != "") {
			// we send the message to all other sockets in the room except this user
			socket.broadcast.to(content.room).emit('message', { sender: content.username, message: content.message })

			// adding the message to the database
			// we get the room from the database
			const room = await prisma.room.findFirst({
				where: {
					code: content.room
				}
			})
			if (room != null) {
				// we get the user from the database
				let user = await prisma.user.findFirst({
					where: {
						username: content.username,
					}
				});
				if (user != null) {
					// we add the message to the database
					let newMessage = await prisma.message.create({
						data: {
							date: Date.now().toString(),
							content: content.message,
							userId: user.id,
							roomId: room.id
						},
					})
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
			socket.emit("tokenFail");
		}
	})

	// ------------------------------- LOG OUT -----------------------------
	// User closes websocket
	socket.on('disconnect', () => {
		//console.log("A user disconnected")
	})
})

const port = process.env.PORT || 3100
server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
