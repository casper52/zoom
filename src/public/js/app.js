const socket = io();

const set = document.getElementById("set");
const nickNameForm = set.querySelector("#nickName");  

const welcome = document.getElementById("welcome");
const roomNameForm = welcome.querySelector("#roomName");

const room = document.getElementById("room");

room.hidden = true;
welcome.hidden = true;

let roomName;
let nickName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showWelcome(){
    set.hidden = true;
    welcome.hidden = false;
    room.hidden = true;
    const h3 = welcome.querySelector("h3");
    h3.innerText = `Hello, ${nickName}!`;
    roomNameForm.addEventListener("submit", handleRoomSubmit);
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = set.querySelector("#nickName input");
    socket.emit("nickname", input.value, showWelcome);
    nickName = input.value;
    input.value = "";
}

function showRoom(){
    set.hidden = true;
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room #${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomNameForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

nickNameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room #${roomName}    👥 ${newCount}`;    
    addMessage(`${user} 님이 입장했습니다.`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room #${roomName}    👥 ${newCount}`;    
    addMessage(`${left} 님이 나갔습니다.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }    
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});