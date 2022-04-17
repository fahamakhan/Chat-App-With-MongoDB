import express from "express";
const router = express.Router();

let users: any = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

class SocketRouter {
    constructor() {
        this.ioFunction = this.ioFunction.bind(this);
    }
    public ioFunction(io) {
        io.on("connection", (socket: any) => {
            //when ceonnect
            console.log("a user connected.");

            //take userId and socketId from user
            socket.on("addUser", (userId) => {
                addUser(userId, socket.id);
                io.emit("getUsers", users);
            });

            //send and get message
            socket.on("sendMessage", ({ senderId, receiverId, text }) => {
                console.log(receiverId)
                const user = getUser(receiverId);
                console.log(users)

                console.log(user)
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    text,
                });
            });

            //when disconnect
            socket.on("disconnect", () => {
                console.log("a user disconnected!");
                removeUser(socket.id);
            });
        });
        return router;
    };
}

module.exports = new SocketRouter().ioFunction;
