<template>
   <div class="flex h-screen w-screen overflow-hidden items-center justify-center">
        <div class="w-96 grid grid-rows-3 p-10 border-2 border-black rounded-xl">
            <div class="h-full w-full font-bold text-5xl text-center pb-3">LOG UP</div>
            <div class="h-full w-full flex flex-col">
                <div class="w-full h-1/3 relative flex justify-center">
                    <div class="h-full w-3/4 pt-5">
                        <input name="usernameInput" id="usernameInput" type="text" class="w-full border-2 border-black rounded-sm">
                    </div>
                    <label for="usernameInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Username</label>
                </div>
                <div class="w-full h-1/3 relative flex justify-center">
                    <div class="h-full w-3/4 pt-5">
                        <input name="pwdInput" id="pwdInput" type="password" class="w-full border-2 border-black rounded-sm">
                    </div>
                    <label for="pwdInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Password</label>
                </div>
                <div class="w-full h-1/3 relative flex justify-center">
                    <div class="h-full w-3/4 pt-5">
                        <input name="confirmationPWD" id="confirmationPWD" type="password" class="w-full border-2 border-black rounded-sm">
                    </div>
                    <label for="confirmationPWD" class="absolute top-0 left-8 text-md bg-white rounded-sm">Confirmation of Password</label>
                </div>
            </div>
            <div class="h-full w-full pt-3">
                <div id="textError" class="w-full h-fit text-red-600"></div>
                <div class="w-full h-1/2 px-5">
                    <button type="button" @click="logup" id="createButton" class="h-full w-full border-2 border-black rounded-md">CREATE</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
//TODO : hasher le password

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

const socket = io("http://localhost:3000");

async function logup(){
    console.log("1");
    let username = document.getElementById("usernameInput").value;
    let pwd = encrypt(document.getElementById("pwdInput").value);
    let confirmationPWD = encrypt(document.getElementById("confirmationPWD").value);
    if (username != null && pwd != null && pwd == confirmationPWD){
        console.log("2");
        socket.emit("logupAttempt", {username : username, password : pwd});
    }
}

socket.on("logupSuccess", (content) => {
    window.location.href="/login"
})

socket.on("logupFailed", (content) => {
    document.getElementById("textError").innerText = content.error;
})
</script>