import express from "express"
import path from 'path'
import http from 'http'
import socketIO from 'socket.io'
import LuckyNumberGame from "./luckyNumbersGame"


const port: number = 3000

class App {
    private server: http.Server
    private port: number

    private io : socketIO.Server 
    private game: LuckyNumberGame 

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app)
        this.io = new socketIO.Server(this.server)

        this.game = new LuckyNumberGame() ; 

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log(`A user has been connected: ` + socket.id) ;

            // assgin new connection's socket id with a number
            this.game.luckyNumbers[socket.id as any] = Math.floor(Math.random() * 10 )  ; 

            socket.emit("message", "Hello " + socket.id + ", your lucky number is " + this.game.luckyNumbers[socket.id as any]) ;

            socket.broadcast.emit("message", "Evevry body say hello to " + socket.id ) ; 
            
            socket.on('disconnect', function() {
                console.log("Socket has disconnected ") ;
            })
        })
        
        setInterval(() => {
            let randomNumber : number = Math.floor(Math.random() * 10) ;
            let winners = this.game.GetWinners(randomNumber) ; 
            if (winners.length) {
                winners.forEach(w => {
                    // w here is the socket id thet has the winninng number
                    // sending mess to one specific socket 
                    this.io.to(w).emit("message", "*** You are the winner ***")
                })
            }
            this.io.emit("random", randomNumber)
        }, 1000)
        

    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port  hello world ${this.port}.`)
        })
    }
}

new App(port).Start()