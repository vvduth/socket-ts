import { GameState } from "./gameState";
import Player from "./player";
export default class LuckyNumbersGame {
    private _id: number
    private _title: string
    private _logo: string
    private _duration: number
    private _gamePhase: number = 0
    private _gameClock: number = 0
    private _result: number = -1
    private _gameState!: GameState;
    private _players: { [id: string]: Player } = {}
    private _guesses: { [id: string]: number[] } = {}
    private _enterPoints: number
    private _updateChatCallBack: (chatMessage: ChatMessage) => void ; 

    constructor(id: number, title: string, logo: string, duration: number , enterPoints: number,
        players: { [id: string]: Player }, updateChatCallBack: (chatMessage: ChatMessage) => void) {
        this._id = id
        this._title = title
        this._logo = logo
        this._duration = duration
        this._players = players
        this._enterPoints = enterPoints
        this._updateChatCallBack = updateChatCallBack 
        setInterval(() => {
            if (this._gamePhase === 0) {
                this._gameClock = this._duration
                this._gamePhase = 1
                this._guesses = {}
                this._updateChatCallBack(<ChatMessage>{
                    message: 'New Game',
                    from: this._logo,
                    type: 'gameMessage',
                })
            } else if (this._gamePhase === 1) {
                if (this._gameClock < 0) {
                    this._gamePhase = 2
                    this._updateChatCallBack(<ChatMessage>{
                        message: 'Game Closed',
                        from: this._logo,
                        type: 'gameMessage',
                    })
                }
            } else if (this._gamePhase === 2) {
                if (this._gameClock === -2 ) {
                    this._result = Math.floor(Math.random() * 10 ) +1  ; 
                    this._updateChatCallBack(<ChatMessage>{
                        message: 'Result: ' +this._result ,
                        from : this._logo, 
                        type: 'gameMessage' 
                    })
                }
                else if (this._gameClock <= -5) { this._gamePhase = 0 }
            }
            this._gameState = {
                id: this._id,
                title: this._title,
                logo: this._logo,
                gamePhase: this._gamePhase,
                gameClock: this._gameClock,
                duration: this._duration,
                result: this._result ,
            }
            this._gameClock -= 1
        }, 1000)
    }
    public get gameState() {
        return this._gameState
    }
    public submitGuess(playerSocketId: string, guess: number ): boolean {
        if (!this._guesses[playerSocketId]) {
            this._guesses[playerSocketId] = []
        }
        this._players[playerSocketId].adjustScore(this._enterPoints * -1)
        this._guesses[playerSocketId].push(guess)
        if (this._guesses[playerSocketId].length === 1) {
            let chatMessage = <ChatMessage>{
                message: this._players[playerSocketId].screenName.name + " is playing", 
                from: this._logo, 
                type: 'gameMessage',
            }
            this._updateChatCallBack(chatMessage) ; 
        }
        return true
    }
}