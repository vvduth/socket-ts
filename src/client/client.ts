type ChatMessage = {
    message: String, 
    from : String ,
}

type ScreenName = {
    name: string
    abbreviation: string
}
type Player = {
    score: number
    screenName: ScreenName
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
            this.player = player ; 
            $('.screenName').text(player.screenName.name)
            $('.score').text(player.score)
        })
        // 
        this.socket.on('chatMessage', (chatMessage: ChatMessage) => {
            $('#messages').append(
                "<li><span class='float-right'><span class='circle'>" +
                    chatMessage.from +
                    "</span></span><div class='otherMessage'>" +
                    chatMessage.message +
                    '</div></li>'
            )
            this.scrollChatWindow()
        })
    }

    private scrollChatWindow = () => {
        $('#messages').animate(
            {
                scrollTop: $('#messages li:last-child').position().top,
            }, 
            500
        )
        setTimeout(()=> {
            let messageLength = $('#messages li');
            if(messageLength.length > 10 ) 
            if (messageLength.length > 10 ) {
                messageLength.eq(0).remove()
            }
        }, 500)
    }
    public sendMessage() {
        let messageText = $('#messageText').val() as String ; 
        if (messageText?.toString().length > 0) {   
            // as written in the note this is emiting and also define event is chatMessage
            this.socket.emit('chatMessage', <ChatMessage>{
                message: messageText, 
                from : this.player.screenName.abbreviation, 
            })
            // this will append in to the user to send the messges
            $('#messages').append(
                "<li><span class='float-left'><span class='circle'> " + this.player.screenName.abbreviation + " </span></span><div class='myMessage'>" +
                messageText +
                '</div></li>'
            )
            this.scrollChatWindow() ;
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