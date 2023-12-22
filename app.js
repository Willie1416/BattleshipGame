//Author: William Hall

var express = require('express');
var routes = require('./routes.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});

const port = 3000;

//Get access to request body for POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Apply CORS to allow cross origin access
app.use(cors());

//use routes modue for /
app.use('/', routes);

io.on("connection", function(socket){

    //Listens for a move being made on the board
    socket.on('movePlayed', function(move){
        socket.broadcast.emit('move', move); //Broadcasts the move to all connected sockets except the sender
    });

    //Listens for the reset button to be clicked 
    socket.on('reset', function(){
        socket.broadcast.emit('reseting') //Broadcasts the rest to all connected sockets to reset the miniboard except sender
        
    });

    //Listen for user to leave the game
    socket.on('disconnect',function(){
        socket.broadcast.emit('reseting'); //Broadcasts that the user has left and resets the miniboard
    });

})

//Listen for connections on port 3000
http.listen(port, () => console.log("Server running on port: "+port));

