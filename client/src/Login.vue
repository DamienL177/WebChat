<template>
    <div class="flex h-screen w-screen overflow-hidden items-center justify-center">
        <div class="grid grid-rows-3 h-96 p-10 border-2 border-black rounded-xl">
            <div class="h-full w-full font-bold text-7xl text-center pb-3">LOG IN</div>
            <div class="h-full w-full flex flex-col">
                <div class="w-full h-1/2 relative flex justify-center">
                    <div class="h-full w-3/4 pt-5">
                        <input name="usernameInput" id="usernameInput" type="text" class="w-full border-2 border-black rounded-sm">
                    </div>
                    <label for="usernameInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Username</label>
                </div>
                <div class="w-full h-1/2 relative flex justify-center">
                    <div class="h-full w-3/4 pt-5">
                        <input name="pwdInput" id="pwdInput" type="password" class="w-full border-2 border-black rounded-sm">
                    </div>
                    <label for="pwdInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Password</label>
                </div>
                <div id="textError" class="w-full h-fit text-red-600"></div>
            </div>
            <div class="h-full w-full pt-3">
                <div class="w-full h-1/2 px-5">
                    <button type="button" @click="connect" id="connectButton" class="h-full w-full border-2 border-black rounded-md">CONNECT</button>
                </div>
                <div class="w-full h-1/2 px-5">
                    <button type="button" @click="toLogUp" id="logupButton" class="h-full w-full border-2 border-black rounded-md">LOG UP</button>
                </div>
            </div>
        </div>
    </div>
  </template>


<script setup>
// TODO : hasher le password
import { io } from "socket.io-client"

const n = 3233;
const e = 17;

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

function toLogUp(){
    window.location.href="/logup"
}

const socket = io("http://localhost:3000");

async function connect(){
    let username = document.getElementById("usernameInput").value;
    let pwd = encrypt(document.getElementById("pwdInput").value);
    document.getElementById("usernameInput").value = "";
    document.getElementById("pwdInput").value = "";
  //console.log("test");
    if (username != null && pwd != null){
        socket.emit("connectionAttempt", {username : username, password : pwd})
    }
    else {
        document.getElementById("textError").innerText = "Please fill both the username and password fields.";
    }
}

socket.on("connectionFail", (content) => {
    document.getElementById("textError").innerText = content.error;
})

socket.on("connectionSuccess", (content) => {
    sessionStorage.setItem("chatRoomUsername", content.username);
    sessionStorage.setItem("chatRoomToken", content.token);
    socket.close();
    window.location.href = "/";
})

</script>
