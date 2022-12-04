"use strict";
class Client {
    constructor() {
        this.socket = io();
        // this connect event handle from the client side only, non related to the sever
        // when refesh, new socket with new id set, clear all the print lines from html document.
        // connet event is the first event that heppen when the web firest start, in the server it is connection. on lcient it is connect
        this.socket.on("connect", function (message) {
            console.log("New connection has been set");
            document.body.innerHTML = "";
        });
        this.socket.on("disconnect", function (message) {
            console.log("disconnected " + message);
            document.body.innerHTML = "Disconected from server : " + message + "<br/>";
            // Message is the string show transport error, noting really special
        });
        this.socket.on("message", (message) => {
            // the logic is after connected, server will emit a message event
            // client side will receri that event and then will emit a mess with thank you for having me back to the server
            console.log(message);
            document.body.innerHTML += message + `<br/>`;
            // emitting message back to the sevrer
            this.socket.emit("message", "Hello, thank you for having me");
            this.socket.emit("thanksresponse", "Hello what is up, thanks a lot.");
        });
        this.socket.on("random", function (message) {
            console.log(message);
            document.body.innerHTML += "Winnging number is " + message + "<br/>";
        });
        this.socket.on("noproblem", function (messsage) {
            document.body.innerHTML += "******* " + messsage + " ********* " + "<br/>";
        });
    }
}
const client = new Client();
