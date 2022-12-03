import express from "express"
import path from 'path'
import http from 'http'
import socketIO from 'socket.io'


const port: number = 3000

class App {
    private server: http.Server
    private port: number

    private io : socketIO.Server 

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app)
        this.io = new socketIO.Server(this.server)

        this.io.on('connection', function(socket: socketIO.Socket) {
            console.log(`A user has been connected: ` + socket.id) ;
            socket.emit("message", "Hello " + socket.id) ;

            socket.broadcast.emit("message", "Evevry body say hello to " + socket.id ) ; 
            
            socket.on('disconnect', function() {
                console.log("Socket has disconnected ") ;
            })
        })
        
        setInterval(() => {
            this.io.emit('random', Math.floor(Math.random() * 10))
        }, 1000)
        

    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port  hello world ${this.port}.`)
        })
    }
}

new App(port).Start()