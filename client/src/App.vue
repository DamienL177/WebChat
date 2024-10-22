<template>
  <div class="flex h-screen w-screen overflow-hidden">
    <div class="w-1/4 h-full border-r-2 border-black flex flex-col">
      <div class="w-full h-36 text-center text-5xl flex justify-center items-center font-bold">ROOMS</div>
      <div class="w-full h-16 flex justify-center">
        <button id="addRoomButton" class="h-full aspect-square" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" class="h-full w-full">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <div class="w-full h-full overflow-y-auto room" idRoom="0">
        <div class="w-full h-20 text-xl flex justify-center items-center cursor-pointer">general</div>
      </div>
    </div>
    <div class="w-3/4 h-full flex flex-col">
      <div class="h-16 w-full grid grid-cols-12 items-center pl-5">
        <div class="col-span-2 h-16 w-full text-xl flex items-center">RoomCode: </div>
        <div id="roomCode" class="col-span-6 h-16 w-full text-2xl font-bold flex items-center">000000</div>
        <div class="col-span-1 w-full h-16 invisible">
          <button class="h-full aspect-square p-2" type="button" id="roomParameterButton">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-full h-full rounded-full bg-gray-500">
              <path fill-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button type="button" id="profileButton" class="col-span-3 w-full h-16 flex items-center p-2 border-l-2 border-black rounded-l-lg">
          <div class="max-w-1/4 h-full aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="h-full w-full rounded-full border-2 border-black">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="w-3/4" id="username">Username</div>
        </button>
      </div>
      <div class="w-full h-full overflow-y-auto border-y-2 border-black flex flex-col" ref="listMessages" id="listMessages">
        <div class="hidden w-full h-fit pr-20 mt-5 flex flex-col" ref="exempleMessage" id="exempleMessage">
          <div class="h-10 w-40 text-sm flex items-center font-bold border-2 border-l-0 border-black rounded-r-lg" tag="name">Name</div>
          <div class="min-w-40 w-fit text-xs flex items-center border-2 border-l-0 border-black rounded-r-lg" tag="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel nisl sem. Nulla orci turpis, tempus interdum imperdiet vel, sollicitudin id libero. Sed ac laoreet justo. Sed lacinia sem lacus, ac suscipit erat mollis at. Praesent gravida, lectus id elementum commodo, metus libero porta odio, vitae volutpat lorem nibh nec erat. Ut tincidunt efficitur enim gravida posuere. Vestibulum id orci congue, ultricies elit eu, hendrerit purus. Praesent porttitor erat et suscipit posuere. Nam porttitor ex ante, nec ultricies justo pellentesque in. Morbi lobortis posuere mauris, at fringilla odio cursus in. Praesent in nulla vel nisl consectetur fringilla id at odio. Suspendisse id ipsum non turpis volutpat aliquet ut a turpis. Maecenas quis quam pellentesque, auctor mi ut, dictum eros. Vestibulum sed purus at eros bibendum suscipit. Sed leo mauris, bibendum quis neque ac, fringilla auctor urna. Mauris consequat eget ligula sed laoreet.</div>
        </div>
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
import {ref} from "vue"

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

const socket = io("http://localhost:3000");

socket.send("token", {test:"test"});

function sendMessage(){
  //console.log("test");
  if (tokenOK){
    let user = "User"
    let message = document.getElementById("writtenMessage").value;
    let token = "";

    if (message.trim()){
      showMessage(user, message, true);
      socket.emit("message", {username : user, message : message, token : token})
    }
    document.getElementById("writtenMessage").value = "";
  }
}

socket.on("tokenOK", () => {
  tokenOK = true;
})

socket.on("message", (content) => {
  if (tokenOK){
    showMessage(content.user, content.message, false);
  }
})
</script>
