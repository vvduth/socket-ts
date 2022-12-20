# ALl the tips I learnt from this project
* <script src="socket.io/socket.io.js"></script>
* is the script we pull direactly from server-ts, socket.top has some built in code that loacted in /socket.io path 
* we have the option to disable that as well 
* generate client js from ts, the client in t dist will be jsm the client in src will be written in ts

# Communication between client and server socket.io
* connect and disconnect: we already knwo and the name say themselves
* close or refesahs, this disconnect event will be fired
* 

# Emitting messase:
* client connect to the server, then the server will send a message hello with the socket id

# How to get the  get the emit message from server side
* In the server code, socket.emit, define the protocol fo rthe client side to notice, while im typing this, my example is message
* In client, this.socket.on, after that put the same protocol on the sevrer, follow by a fuinction with the param, the param is the content of the message we want ot pass from the server
* We can literally pass anything, string, obj, etc,...

# Broadcast
* send mess to everyong who is connected, send to all connected msocket except for itself

# What about io.emit
* we learnt about socket.emit
* now  this.io.emit
* example: from the server we genrate a random number every second and we send it to all the connected clients (sockets)

# We can implenet connect, disconnect and emit events from client too
* so basically from what I have learnt, event aka messages can be pass from server to client the client to sevrer, back and forth.
* we need to implement the event from on side with this.socket.on/emit... and on the other side, we need to create a listener to listen and receive mess from the event that been fired.
* use specific event string to make it easier to manage the system
* on :listening to event 
* emit: send message abck and forth
* broadcast: you knwo it bra

# The game notes
* chat fucntrionality 
* so here is the basic idea of how chat functionality work: 
* one user press send button from the client, the event will trigger sendMess() function from client which will execute the socket.emit('chatMessage'), after that, it will form the message including the content and from, send it message to the server.ts
* the server wiill receive the event through socket.on('chatMessage'), receive the message from the user and then inside the socket.on(), sever will socket.emit('chatMessage') back to other users