"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var users = [];
var addUser = function (userId, socketId) {
    !users.some(function (user) { return user.userId === userId; }) &&
        users.push({ userId: userId, socketId: socketId });
};
var removeUser = function (socketId) {
    users = users.filter(function (user) { return user.socketId !== socketId; });
};
var getUser = function (userId) {
    return users.find(function (user) { return user.userId === userId; });
};
var SocketRouter = /** @class */ (function () {
    function SocketRouter() {
        this.ioFunction = this.ioFunction.bind(this);
    }
    SocketRouter.prototype.ioFunction = function (io) {
        io.on("connection", function (socket) {
            //when ceonnect
            console.log("a user connected.");
            //take userId and socketId from user
            socket.on("addUser", function (userId) {
                addUser(userId, socket.id);
                io.emit("getUsers", users);
            });
            //send and get message
            socket.on("sendMessage", function (_a) {
                var senderId = _a.senderId, receiverId = _a.receiverId, text = _a.text;
                console.log(receiverId);
                var user = getUser(receiverId);
                console.log(users);
                console.log(user);
                io.to(user.socketId).emit("getMessage", {
                    senderId: senderId,
                    text: text,
                });
            });
            //when disconnect
            socket.on("disconnect", function () {
                console.log("a user disconnected!");
                removeUser(socket.id);
            });
        });
        return router;
    };
    ;
    return SocketRouter;
}());
module.exports = new SocketRouter().ioFunction;
