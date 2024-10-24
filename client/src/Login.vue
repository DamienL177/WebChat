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
                        <input name="pwdInput" id="pwdInput" type="text" class="w-full border-2 border-black rounded-sm">
                    </div>
                    <label for="pwdInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Password</label>
                </div>
            </div>
            <div class="h-full w-full pt-3">
                <div class="w-full h-1/2 px-5">
                    <button type="button" @click="connect" id="connectButton" class="h-full w-full border-2 border-black rounded-md">CONNECT</button>
                </div>
                <div class="w-full h-1/2 px-5">
                    <button type="button" id="connectButton" class="h-full w-full border-2 border-black rounded-md">LOG UP</button>
                </div>
            </div>
        </div>
    </div>
  </template>


<script setup>
import { io } from "socket.io-client"
import { createApp } from 'vue'
import Main from './Main.vue'

const socket = io("http://localhost:3000");

function connect(){
    let username = document.getElementById("usernameInput").value;
    let pwd =  document.getElementById("pwdInput").value;
  //console.log("test");
    if (username != null && pwd != null){
        socket.emit("connectionAttempt", {username : username, password : pwd})
    }
    else {
        // TODO que faire en cas d'échec de connexion
        console.log("probleme");
    }
}

socket.on("connectionSuccess", (content) => {
    sessionStorage.setItem("chatRoomUsername", content.username);
    sessionStorage.setItem("chatRoomToken", content.token);
    socket.close();
    window.location.href = "/";
})

</script>
