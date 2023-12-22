/////////////////////////////////////////////////////////////////////////////////
//Author: William Hall
//Purpose: Controls the bidirectional sockets of the battleship game
/////////////////////////////////////////////////////////////////////////////////
//mySocket.js
var myURL = "http://127.0.0.1:3000";
var socket = io(myURL, {secure: true});


$.ajax({
    url: myURL,
    type: 'GET',
    success: function (data) {
        socket.emit('emit_from_here');
    }
});

socket.on('move', function (move) {
    opponentMoves(move) // recieves the move made by the other player from the server and updates the miniboard 
});

socket.on('reseting', function(){
    miniTable(); // recieves a message from the server that the other player have restarted their game to update miniboard
})
