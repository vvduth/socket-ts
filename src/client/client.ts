type ChatMessage = {
    message: string,
    from: string,
    type: 'playerMessage' | 'gameMessage'
}

type ScreenName = {
    name: string
    abbreviation: string
}
type Player = {
    score: number
    screenName: ScreenName
}
type GameState = {
    id: number
    title: string
    logo: string
    gamePhase: number
    gameClock: number
    duration: number
}

class Client {
    private socket: SocketIOClient.Socket
    private player!: Player

    constructor() {
        this.socket = io()

        this.socket.on('connect', function () {
            console.log('connect')
        })

        // No need for since since the screen name is included in players object
        // this.socket.on('screenName', (screenName: ScreenName) =>  {
        //     this.screenName  = screenName ; 
        //     $('.screenName').text(this.screenName.name) ; 
        // })

        this.socket.on('disconnect', function (message: any) {
            console.log('disconnect ' + message)
            location.reload()
        })

        // this will receive the emit player event and also the player obect from the server
        this.socket.on('playerDetails', (player: Player) => {
            this.player = player;
            $('.screenName').text(player.screenName.name)
            $('.score').text(player.score)
        })
        // 
        this.socket.on('chatMessage', (chatMessage: ChatMessage) => {
            if (chatMessage.type === 'gameMessage') {
                $('#messages').append(
                    "<li><span class='float-left'><span class='circle'>" +
                    chatMessage.from +
                    "</span></span><div class='gameMessage'>" +
                    chatMessage.message +
                    '</div></li>')
            } else {
                $('#messages').append(
                    "<li><span class='float-right'><span class='circle'>" +
                    chatMessage.from +
                    "</span></span><div class='otherMessage'>" +
                    chatMessage.message +
                    '</div></li>'
                )
            }
            this.scrollChatWindow()
        })
        this.socket.on('GameStates', (gameStates: GameState[]) => {
            gameStates.forEach((gameState) => {
                let gid = gameState.id;
                if (gameState.gameClock >= 0) {
                    if (gameState.gameClock >= gameState.duration) {
                        // time is out so start a new game
                        $('#gamephase' + gid).text(
                            "New game, guess the lucky number"
                        )
                    }
                    $('#timer' + gid).css('display', 'block')
                    $('#timer' + gid).text(gameState.gameClock.toString())
                    var progressParent =
                        (gameState.gameClock / gameState.duration) * 100
                    $('#timerBar' + gid).css('background-color', '#4caf50')
                    $('#timerBar' + gid).css('width', progressParent + '%')
                } else {
                    $('#timerBar' + gid).css('background-color', '#ff0000')
                    $('#timerBar' + gid).css('width', '100%')
                    $('#timer' + gid).css('display', 'none')
                    $('#gamephase' + gid).text('Game Closed')
                }
            })
        })
    }

    private scrollChatWindow = () => {
        $('#messages').animate(
            {
                scrollTop: $('#messages li:last-child').position().top,
            },
            500
        )
        setTimeout(() => {
            let messageLength = $('#messages li');
            if (messageLength.length > 10)
                if (messageLength.length > 10) {
                    messageLength.eq(0).remove()
                }
        }, 500)
    }
    public sendMessage() {
        let messageText = $('#messageText').val() as String;
        if (messageText?.toString().length > 0) {
            // as written in the note this is emiting and also define event is chatMessage
            this.socket.emit('chatMessage', <ChatMessage>{
                message: messageText,
                from: this.player.screenName.abbreviation,
            })
            // this will append in to the user to send the messges
            $('#messages').append(
                "<li><span class='float-left'><span class='circle'> " + this.player.screenName.abbreviation + " </span></span><div class='myMessage'>" +
                messageText +
                '</div></li>'
            )
            this.scrollChatWindow();
            $('#messageText').val('')
        }
    }
    public showGame(id: number) {
        switch (id) {
            case 0:
                $('#gamePanel1').fadeOut(100)
                $('#gamePanel2').fadeOut(100)
                $('#gamePanel0').delay(100).fadeIn(100)
                break
            case 1:
                $('#gamePanel0').fadeOut(100)
                $('#gamePanel2').fadeOut(100)
                $('#gamePanel1').delay(100).fadeIn(100)
                break
            case 2:
                $('#gamePanel0').fadeOut(100)
                $('#gamePanel1').fadeOut(100)
                $('#gamePanel2').delay(100).fadeIn(100)
                break
        }
    }
}

const client = new Client()