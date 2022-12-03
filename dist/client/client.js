"use strict";
class Client {
    constructor() {
        this.socket = io();
        this.socket.on("message", function (message) {
            console.log(message);
            document.body.innerHTML += message + `<br/>`;
        });
        this.socket.on("random", function (message) {
            console.log(message);
            document.body.innerHTML += "Winnging numebr is " + message + "<br/>";
        });
    }
}
const client = new Client();
