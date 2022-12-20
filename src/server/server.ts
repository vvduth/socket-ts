import express from 'express'
import path from 'path'
import http from 'http'
import socketIO from 'socket.io'
import LuckyNumbersGame from './luckyNumbersGame'

const port: number = 3000

type ChatMessage = {
    message: string
    from: string
}

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server
    private game: LuckyNumbersGame

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        app.use(
            '/jquery',
            express.static(
                path.join(__dirname, '../../node_modules/jquery/dist')
            )
        )
        app.use(
            '/bootstrap',
            express.static(
                path.join(__dirname, '../../node_modules/bootstrap/dist')
            )
        )

        this.server = new http.Server(app)
        this.io = new socketIO.Server(this.server)

        this.game = new LuckyNumbersGame()

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)

            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id)
            })

            // This shit will probbally receive event chatMessages from client

            socket.on('chatMessage', function (chatMessage: ChatMessage )  {
                console.log("receive event from the client bra")
                socket.broadcast.emit('chatMessage', chatMessage) ; 
            })
        })
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }
}

new App(port).Start()