"use strict";
class Client {
    constructor() {
        this.scrollChatWindow = () => {
            $('#messages').animate({
                scrollTop: $('#messages li:last-child').position().top,
            }, 500);
            setTimeout(() => {
                let messageLength = $('#messages li');
                if (messageLength.length > 10)
                    if (messageLength.length > 10) {
                        messageLength.eq(0).remove();
                    }
            }, 500);
        };
        this.socket = io();
        this.socket.on('connect', function () {
            console.log('connect');
        });
        this.socket.on('disconnect', function (message) {
            console.log('disconnect ' + message);
            location.reload();
        });
        // 
        this.socket.on('chatMessage', (chatMessage) => {
            $('#messages').append("<li><span class='float-right'><span class='circle'>" +
                chatMessage.from +
                "</span></span><div class='otherMessage'>" +
                chatMessage.message +
                '</div></li>');
            this.scrollChatWindow();
        });
    }
    sendMessage() {
        let messageText = $('#messageText').val();
        if ((messageText === null || messageText === void 0 ? void 0 : messageText.toString().length) > 0) {
            // as written in the note this is emiting and also define event is chatMessage
            this.socket.emit('chatMessage', {
                message: messageText,
                from: this.socket.id.toString()
            });
            // this will append in to the user to send the messges
            $('#messages').append("<li><span class='float-left'><span class='circle'>Sender</span></span><div class='myMessage'>" +
                messageText +
                '</div></li>');
            this.scrollChatWindow();
            $('#messageText').val('');
        }
    }
    showGame(id) {
        switch (id) {
            case 0:
                $('#gamePanel1').fadeOut(100);
                $('#gamePanel2').fadeOut(100);
                $('#gamePanel0').delay(100).fadeIn(100);
                break;
            case 1:
                $('#gamePanel0').fadeOut(100);
                $('#gamePanel2').fadeOut(100);
                $('#gamePanel1').delay(100).fadeIn(100);
                break;
            case 2:
                $('#gamePanel0').fadeOut(100);
                $('#gamePanel1').fadeOut(100);
                $('#gamePanel2').delay(100).fadeIn(100);
                break;
        }
    }
}
const client = new Client();
