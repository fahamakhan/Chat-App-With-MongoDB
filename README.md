# Chat Application Using Socketio
Node JS project for chat application using socket.io

## Requriments

1. Nodejs
2. Npm
3. Typescript
4. MongoDB

## Installation

Make sure you have the requirements installed on your machine.

Run mongoDB on default port that is 27017.

Go to the root directory of the project and run the following command:

```
npm install

```
This project is based on TypeScript. So, you need to install TypeScript compiler.
If you don't want to do so then latest JS build is already in the project directory, so you can skip this step.

Go to build folder and run the following command:

```
node server.js

```

If you can't find the build folder in the project directory and you have a TypeScript compiler installed then you can run the following command in the root directory of the project:


```
tsc
    
```
and then run the server.js file in the build folder by running the above command.


## Testing APIs

Here's the Postman documentation for APIs:
    
    []: # Language: markdown
    []: # Path: https://documenter.getpostman.com/view/17101335/Uyr5oK5y


## Testing Sockets

To test sockets or use the chat feature what you would have to do is connect to the socket server with client by making connection with following URL: 
    
```
ws://localhost:3005
```
After that you can send messages to the server by using the following code:
    
```
socket.emit("addUser", userId);
```
    
You can get online users by using the following code:
    
```
socket.on("getUsers", (users) => {
    console.log(users);
});
```

You can send a message to online user by:
        
```
socket.emit("sendMessage", {
senderId: auth.body.userId,
receiverId: adminId,
text: newMessage,
});
```

You can receive messages by using the following code:
        
```
socket.current.on("getMessage", (data) => {
console.log(data)
});

```
