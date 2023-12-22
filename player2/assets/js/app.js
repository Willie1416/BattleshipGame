var gamePlay = {
    battleship: battleship,
    
    //Get the user inputed username in the login from the url
    getUsername() {
        const queryParams = new URLSearchParams(window.location.search);
        
        const username = queryParams.get("username");

        //Send the username to update the view with the username
        return username;
    },

    //Initialize the game board and creates vessels that are places on the board
    playgame(){
        this.reset();
    },

    //Checks if all vessels are sunken to determine if game is over
    isGameOver(){
        const allShipsMarked = this.battleship.sunkenShips();
        return allShipsMarked;
    },

    //Restarts the game by clearing the game table and messages and initializing a new game
    reset() {

        generateTable(); //Generates a new gametable that the user can click on
        clearMessages(); //Clears the message div
        
        //Initialize a new game after everything as been reseted by initializing a new gameboard and putting ships on it
        this.battleship.initialize();
        this.battleship.createShips();
    }


};

//Play the game and display their username
var username = gamePlay.getUsername();
displayUsername(username);
gamePlay.playgame();





