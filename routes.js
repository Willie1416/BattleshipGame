//Author: William Hall
//Description: This routes module creates custom routes and demonstrates the use of routes using the database manager module

var express = require('express');
var router = express.Router();
//use database manager module
var mydb = require('./dbmgr.js');

//use the url module
const url = require('url');

// Tracks the playerscore
var player1Score = 0;
var player2Score = 0;
// Keeps track of moves made by each user in an array
var player1Moves = [];
var player2Moves = [];

//Setup database, only need to run this once. Unblock to run once then block this line again
//mydb.setup();

//accepts a POST request and stores a unique username in the database using insertUsername()
router.post('/username', function (req, res) {
    var username = req.body;
    mydb.insertUsername(username); 
});


//player 1 route
router.get('/player1', function (req, res) {
    try{
        let myURL = url.parse(req.url, true); //parses the URL
        var gameStatus = myURL.query.status; //retrieves the game status from URL
        var gameMove = myURL.query.move; //retrieves the game move from URL
        var username = myURL.query.username //retrieves the username from URL

        if (gameStatus == 'reset') {
            player1Moves = [] // reset moves made
            player1Score = 0;
            res.end();

        }
        // When game over send the username and number of moves made(score) to the database
        else if (gameStatus == "gameover"){
            let user = {username: username}
            let score = {score: player1Score}

            mydb.insertScore(user, score);
            player1Moves = [] // reset moves made
            player1Score = 0;
            res.end()
            
        }
        else{
            player1Moves.push({gameMove, gameStatus}) // add the move to the array
            player1Score++
            // Send the array with moves so that the other player can update mintable if connecting later
            res.end(JSON.stringify(player1Moves)); 
           
        }
    }catch(err){ //Error handler
        throw err; 
    }
});

//Player 2 route
router.get('/player2', function (req, res) {
    try{
        let myURL = url.parse(req.url, true); //parses the URL
        var gameStatus = myURL.query.status; //retrieves the game status from URL
        var gameMove = myURL.query.move; //retrieves the game move from URL
        var username = myURL.query.username //retrieves the username from URL
       


        if (gameStatus === 'reset') {
            player2Moves = [] // reset moves made
            player2Score = 0;
            res.end();
            
        }
        // When game over send the username and number of moves made(score) to the database
        else if (gameStatus == "gameover"){
            let user = {username: username}
            let score = {score: player2Score}

            mydb.insertScore(user, score);
            player2Moves = [] // reset moves made
            player2Score = 0;
            res.end()
            
        }
        else{
            player2Moves.push({gameMove, gameStatus}) // add the move to the array
            player2Score++
            // Send the array with moves so that the other player can update mintable if connecting later
            res.end(JSON.stringify(player2Moves));
            
        }
    }catch(err){ //Error handler
        throw err; 
    }
});

//highscores route to find top 10 records in the database
router.get('/highscores', function (req, res) {
    //finds the top 10 scores in the database
    try{
        mydb.findAll(10, function(result){
            res.send(JSON.stringify(result));
        });
    }
    catch(err){
        throw err;
    }
});

// route to delete collection in the database
router.get('/p6', function (req, res) {
    mydb.deleteCollection();
    res.send("Deleted Collection");
});

module.exports = router;
