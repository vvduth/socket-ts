class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        this.socket.on("message", function(message: any) {
            console.log(message) ; 
            document.body.innerHTML += message +`<br/>`  ; 
        })

        this.socket.on("random", function(message: any) {
            console.log(message) ; 
            document.body.innerHTML += "Winnging number is " + message + "<br/>" ; 
        })
    }
}

const client = new Client()