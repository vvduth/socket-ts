import express from 'express'
import path from 'path'
import http from 'http'
import socketIO from 'socket.io'
import LuckyNumbersGame from './luckyNumbersGame'
import RandomScreenNAmeGenerator from './randomScreenNameGenerator'
import Player from './player'

const port: number = 3000

type ChatMessage = {
    message: string
    from: string
}

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server
    private games: {[id: number]: LuckyNumbersGame} = {}
    private randomScreenNameGenerator: RandomScreenNAmeGenerator 
    // hash map probably
    private players: {[id: string]: Player} = {} 

    

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

        this.games[0] = new LuckyNumbersGame(0, 'Bronze Game', '🥉', 10, this.updateChat)
        this.games[1] = new LuckyNumbersGame(1, 'Silver Game', '🥈', 16, this.updateChat)
        this.games[2] = new LuckyNumbersGame(2, 'Gold Game', '🥇', 35, this.updateChat)

        this.randomScreenNameGenerator = new RandomScreenNAmeGenerator()

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id)

            let screenName = this.randomScreenNameGenerator.generateRandomScreenName() ;

            this.players[socket.id] = new Player(screenName ) ; 

            socket.emit('playerDetails', this.players[socket.id].player) ; 

            socket.emit('screenName', screenName)

            socket.on('disconnect',  () =>  {
                console.log('socket disconnected : ' + socket.id)
                if (this.players && this.players[socket.id]) {
                    delete this.players[socket.id]
                }
            })

            // This shit will probbally receive event chatMessages from client
            socket.on('chatMessage', function (chatMessage: ChatMessage )  {
                console.log("receive event from the client bra")
                socket.broadcast.emit('chatMessage', chatMessage) ; 
            })
        })

        setInterval(() => {
            this.io.emit('GameStates', [
                this.games[0].gameState ,
                this.games[1].gameState , 
                this.games[2].gameState
             ])
        }, 1000)
    }
    public updateChat = (chatMessage: ChatMessage) => {
        this.io.emit('chatMessage', chatMessage) ; 
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }
}

new App(port).Start()