"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.default.Server(this.server);
        this.io.on('connection', function (socket) {
            console.log(`A user has been connected: ` + socket.id);
            socket.emit("message", "Hello " + socket.id);
            socket.broadcast.emit("message", "Evevry body say hello to " + socket.id);
            socket.on('disconnect', function () {
                console.log("Socket has disconnected ");
            });
        });
        setInterval(() => {
            this.io.emit('random', Math.floor(Math.random() * 10));
        }, 1000);
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port  hello world ${this.port}.`);
        });
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map