<template>
  <div class="relative flex h-screen w-screen overflow-hidden">
    <div id="logoutDiv" class="hidden absolute w-screen h-screen bg-gray-500/60">
      <div class="absolute w-96 h-60 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 bg-white border-2 border-black rounded-3xl">
        <div class="w-full h-1/2 font-bold text-5xl flex items-center justify-center">Log out?</div>
        <div class="w-full h-1/2 grid grid-cols-2 p-5 gap-5">
          <button id="hideLogoutButton" type="button" @click="changeVisibilityLogout" class="w-full h-full flex items-center justify-center rounded-xl text-white bg-red-600">No</button>
          <button id="logoutButton" type="button" @click="logout" class="w-full h-full flex items-center justify-center rounded-xl text-white bg-green-600">Yes</button>
        </div>
      </div>
    </div>
    <div id="createRoomDiv" class="hidden absolute w-screen h-screen bg-gray-500/60">
      <div class="absolute w-96 h-96 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 bg-white border-2 border-black rounded-3xl">
        <div class="w-full h-1/4 font-bold text-5xl flex items-center justify-center">Create room</div>
        <div class="w-full h-3/4 p-5">
          <div class="w-full h-2/3 pb-5">
            <div class="w-full h-1/3 relative flex justify-center">
              <div class="h-full w-3/4 pt-5">
                <input name="nameInput" id="nameInput" type="text" class="w-full border-2 border-black rounded-sm">
              </div>
              <label for="nameInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Name</label>
            </div>
            <div class="hidden w-full h-1/3 relative flex justify-center">
              <div class="h-full w-3/4 pt-5">
                <input name="codeRoom" id="codeRoom" type="text" class="w-full border-2 border-black rounded-sm" disabled>
              </div>
              <label for="codeRoom" class="absolute top-0 left-8 text-md bg-white rounded-sm">code</label>
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
          <div class="w-full h-1/3 grid grid-cols-2 gap-5 pb-6">
            <button type="button" @click="cancelRoomCreation" id="cancelRoomCreation" class="h-full w-full border-2 border-black rounded-md">CANCEL</button>
            <button type="button" @click="createRoom" id="createButton" class="h-full w-full border-2 border-black rounded-md">CREATE</button>
          </div>
        </div>
      </div>
    </div>
    <div id="connectRoomDiv" class="hidden absolute w-screen h-screen bg-gray-500/60">
      <div class="absolute w-96 h-96 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 bg-white border-2 border-black rounded-3xl">
        <div class="w-full h-1/4 font-bold text-5xl flex items-center justify-center">Add room</div>
        <div class="w-full h-3/4 p-5">
          <div class="w-full h-2/3 pb-5">
            <div class="w-full h-1/3 relative flex justify-center">
              <div class="h-full w-3/4 pt-5">
                <input name="codeRoom" id="connectCodeRoom" type="text" class="w-full border-2 border-black rounded-sm">
              </div>
              <label for="codeRoom" class="absolute top-0 left-8 text-md bg-white rounded-sm">code</label>
            </div>
            <div class="w-full h-1/3 relative flex justify-center">
              <div class="h-full w-3/4 pt-5">
                <input name="pwdInput" id="connectPwdInput" type="password" class="w-full border-2 border-black rounded-sm">
              </div>
              <label for="pwdInput" class="absolute top-0 left-8 text-md bg-white rounded-sm">Password</label>
            </div>
          </div>
          <div class="w-full h-1/3 grid grid-cols-2 gap-5 pb-6">
            <button type="button" @click="cancelRoomConnexion" id="cancelRoomConnexion" class="h-full w-full border-2 border-black rounded-md">CANCEL</button>
            <button type="button" @click="connectRoom" id="connectButton" class="h-full w-full border-2 border-black rounded-md">CONNECT</button>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/4 h-full border-r-2 border-black flex flex-col">
      <div class="w-full h-36 text-center text-5xl flex justify-center items-center font-bold">ROOMS</div>
      <div class="w-full h-16 px-10 grid grid-cols-2 gap-10 justify-center items-center">
        <button @click="openCreateRoomDiv" id="addRoomButton" class="h-full font-bold border-2 border-black rounded-lg" type="button">
          CREATE
        </button>
        <button @click="changeVisibilityConnectRoom" id="connectRoomButton" class="h-full font-bold border-2 border-black rounded-lg" type="button">
          ADD
        </button>
      </div>
      <div id="generalRoom" @click="joinGeneral" class="w-full h-fit" idRoom="0">
        <div class="w-full h-20 text-xl flex justify-center items-center cursor-pointer">general</div>
      </div>
      <ul id="listRooms" class="w-full h-2/3 overflow-y-auto">

      </ul>
    </div>
    <div class="w-3/4 h-full flex flex-col">
      <div class="h-16 w-full grid grid-cols-12 items-center pl-5">
        <div class="col-span-2 h-16 w-full text-xl flex items-center">RoomCode: </div>
        <div id="roomCode" class="col-span-6 h-16 w-full text-2xl font-bold flex items-center">general</div>
        <div class="col-span-1 w-full h-16 invisible">
          <button class="h-full aspect-square p-2" type="button" id="roomParameterButton">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-full h-full rounded-full bg-gray-500">
              <path fill-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button type="button" id="profileButton" @click="changeVisibilityLogout" class="col-span-3 w-full h-16 flex items-center p-2 border-l-2 border-black rounded-l-lg">
          <div class="max-w-1/4 h-full aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="h-full w-full rounded-full border-2 border-black">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="w-3/4" id="username">Username</div>
        </button>
      </div>
      <div class="hidden w-full h-fit pr-20 mt-5 flex flex-col" ref="exempleMessage" id="exempleMessage">
        <div class="h-10 w-40 text-sm flex items-center font-bold border-2 border-l-0 border-black rounded-r-lg" tag="name">Name</div>
        <div class="min-w-40 w-fit text-xs flex items-center border-2 border-l-0 border-black rounded-r-lg" tag="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel nisl sem. Nulla orci turpis, tempus interdum imperdiet vel, sollicitudin id libero. Sed ac laoreet justo. Sed lacinia sem lacus, ac suscipit erat mollis at. Praesent gravida, lectus id elementum commodo, metus libero porta odio, vitae volutpat lorem nibh nec erat. Ut tincidunt efficitur enim gravida posuere. Vestibulum id orci congue, ultricies elit eu, hendrerit purus. Praesent porttitor erat et suscipit posuere. Nam porttitor ex ante, nec ultricies justo pellentesque in. Morbi lobortis posuere mauris, at fringilla odio cursus in. Praesent in nulla vel nisl consectetur fringilla id at odio. Suspendisse id ipsum non turpis volutpat aliquet ut a turpis. Maecenas quis quam pellentesque, auctor mi ut, dictum eros. Vestibulum sed purus at eros bibendum suscipit. Sed leo mauris, bibendum quis neque ac, fringilla auctor urna. Mauris consequat eget ligula sed laoreet.</div>
      </div>
      <div class="w-full h-full overflow-y-auto border-y-2 border-black flex flex-col" ref="listMessages" id="listMessages">
      </div>
      <div class="h-20 w-full grid grid-cols-6 items-center">
        <div class="col-span-5 w-full h-full">
          <textarea id="writtenMessage" @keyup.enter="sendMessage" class="w-full h-full resize-none border-r-2 border-black px-2" placeholder="Write your message..."></textarea>
        </div>
        <div id="sendButton" @click="sendMessage" class="col-span-1 w-full h-full flex flex-col cursor-pointer">
          <p class="w-full text-center">Send</p>
          <div class="h-10 aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="h-full w-full">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client"
import { createApp } from 'vue'
import Login from './Login.vue'

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

let tokenOK = false;

function showMessage(user, message, isLocalUser){
  let messageExemple = document.getElementById("exempleMessage");
  let messageDiv = messageExemple.cloneNode(true);
  //console.log(messageExemple.cloneNode())
  messageDiv.removeAttribute("id");
  messageDiv.classList.remove("hidden");
  messageDiv.firstChild.innerText = user;
  messageDiv.lastChild.innerText = message;
  if (isLocalUser){
    messageDiv.classList.add("items-end");
    messageDiv.classList.remove("pr-20");
    messageDiv.classList.add("pl-20");
    let divName = messageDiv.firstChild;
    let divMessage = messageDiv.lastChild;
    divName.classList.remove("border-l-0");
    divName.classList.add("border-r-0");
    divMessage.classList.remove("border-l-0");
    divMessage.classList.add("border-r-0");
    divName.classList.remove("rounded-r-lg");
    divName.classList.add("rounded-l-lg");
    divMessage.classList.remove("rounded-r-lg");
    divMessage.classList.add("rounded-l-lg");
  }
  let div = document.getElementById("listMessages");
  div.append(messageDiv);
  div.scrollTop = div.scrollHeight;  
}

let token = sessionStorage.getItem("chatRoomToken");
let username = sessionStorage.getItem("chatRoomUsername");
sessionStorage.setItem("room", "general");

let socket;
if (username != null && username != "" && token != null && token != ""){
  socket = io("http://localhost:3000");

  socket.emit("tokenConnection", {username : username, token : token});

  socket.on("tokenOK", () => {
    tokenOK = true;
    document.getElementById("username").textContent = username;
    socket.emit("roomKnown", {username : username, token : token});
  })

  socket.on("tokenFail", () => {
    console.log("tokenFailed");
    // TODO : quoi faire ici
    alert("Token expired.");
    logout();
  })

  socket.on("message", (content) => {
    if (tokenOK){
      showMessage(content.sender, content.message, false);
    }
    else {
      // TODO : what to do when token not ok
      alert("Token expired.");
      logout();
    }
  })

  socket.on("roomCode", (content) => {
    document.getElementById("codeRoom").value = content.code;
    changeVisibilityCreateRoom();
  })

  socket.on("roomAccessible", (content) => {
    let roomDiv = document.getElementById("generalRoom").cloneNode(true);
    roomDiv.removeAttribute("id");
    roomDiv["creator"] = content.creator;
    roomDiv["code"] = content.code;
    roomDiv.firstChild.innerText = content.name;
    roomDiv.addEventListener("click", () => {
      socket.emit("leaveRoom", {code : sessionStorage.getItem("room")});
      socket.emit("joinRoom", {code : content.code, username : username});
      let div = document.getElementById("listMessages");
      div.innerHTML = "";
      document.getElementById("writtenMessage")["disabled"] = true;
      sessionStorage.setItem("room", content.code);
    })
    document.getElementById("listRooms").appendChild(roomDiv);
  })

  socket.on("roomJoined", (content) => {
    let roomHistory = content.roomHistory;
    roomHistory.forEach(message => {
      showMessage(message.username, message.message, message.currentUser);
    });
    document.getElementById("roomCode").innerText = content.roomCode;
    document.getElementById("writtenMessage").removeAttribute("disabled");
  })
}
else {
  window.location.href = "/login";
}

function joinGeneral(){
  socket.emit("leaveRoom", {code : sessionStorage.getItem("room")});
  socket.emit("joinRoom", {code : "general"});
  let div = document.getElementById("listMessages");
  div.innerHTML = "";
  document.getElementById("writtenMessage")["disabled"] = true;
  sessionStorage.setItem("room", "general");
}

function logout(){
  sessionStorage.removeItem("chatRoomToken");
  sessionStorage.removeItem("chatRoomUsername");
  window.location.href = "/login";
}

function changeVisibilityLogout(){
  let div = document.getElementById("logoutDiv");
  if (div.classList.contains("hidden")){
    div.classList.remove("hidden");
  }
  else {
    div.classList.add("hidden");
  }
}

function changeVisibilityCreateRoom(){
  let div = document.getElementById("createRoomDiv");
  if (div.classList.contains("hidden")){
    div.classList.remove("hidden");
  }
  else {
    div.classList.add("hidden");
  }
}

function changeVisibilityConnectRoom(){
  let div = document.getElementById("connectRoomDiv");
  if (div.classList.contains("hidden")){
    div.classList.remove("hidden");
  }
  else {
    div.classList.add("hidden");
  }
}

function sendMessage(){
  //console.log("test");
  if (tokenOK){
    let message = document.getElementById("writtenMessage").value;
    let token = "";

    if (message.trim()){
      showMessage(username, message, true);
      socket.emit("message", {username : username, message : message, token : token, room : sessionStorage.getItem("room")})
    }
    document.getElementById("writtenMessage").value = "";
  }
  else {
    alert("Token expired.");
    logout();
  }
}

function openCreateRoomDiv(){
  socket.emit("roomCreationAsk", {username : username, token : token});
}

function cancelRoomCreation(){
  document.getElementById("codeRoom").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("pwdInput").value = "";
  document.getElementById("confirmationPWD").value = "";
  changeVisibilityCreateRoom();
}

function createRoom(){
  let code = document.getElementById("codeRoom").value;
  let roomName = document.getElementById("nameInput").value;
  let pwd = encrypt(document.getElementById("pwdInput").value);
  let confirmationPWD = encrypt(document.getElementById("confirmationPWD").value);
  if (code != null && roomName != null && pwd != null && pwd == confirmationPWD){
    socket.emit("roomCreation", {username : username, token : token, code : code, name : roomName, password : pwd});
    document.getElementById("codeRoom").value = "";
    document.getElementById("nameInput").value = "";
    document.getElementById("pwdInput").value = "";
    document.getElementById("confirmationPWD").value = "";
    changeVisibilityCreateRoom();
  }
}

function cancelRoomConnexion(){
  document.getElementById("connectCodeRoom").value = "";
  document.getElementById("connectPwdInput").value = "";
  changeVisibilityConnectRoom();
}

function connectRoom(){
  let code = document.getElementById("connectCodeRoom").value;
  let pwd = encrypt(document.getElementById("connectPwdInput").value);
  if (code != null && pwd != null){
    socket.emit("logToRoom", {username : username, token : token, code : code, password : pwd});
    cancelRoomConnexion();
  }
}
</script>
