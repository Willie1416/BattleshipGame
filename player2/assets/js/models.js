var boardXLength = 10, boardYLength = 10;
var vessels = [["Cruiser", 2], ["Submarine", 3], ["Destroyer", 4], ["Battleship", 5]]; 
var vesselName = 0; // Variable to accesss vessel name in vessels array
var vesselLength = 1; // Variable to accesss vessel length in vessels array
var allVessels = []; // Array to store all vessels put on the gameboard
var player1Route = 'http://127.0.0.1:3000/player1' // Route name that have the coordinates for player 1
var player2Route = 'http://127.0.0.1:3000/player2' // Route name that have the coordinates for player 2



var ship = {
    name: " ",
    length: 0,
    orientation: " ",
    hits: 0,

    //Set vessel name
    setName: function (name) {
        this.name = name;
    },
    //Get vessel name
    getName: function () {
        return this.name;
    },
    //Set vessel length
    setLength: function (length) {
        this.length = length;
    },
    //Get vessel length
    getLength: function () {
        return this.length;
    },

    //Set vessel orientation
    setOrientation: function (orientation) {
        this.orientation = orientation;
    },

    //Get vessel orientation
    getOrientation: function () {
        return this.orientation;
    },
    //Increments hits on vessel
    incrementHits: function () {
        this.hits++;
    },
    //Gets hits on vessel
    getHits: function () {
        return this.hits;
    },
    //Checks if ship is sunken
    isSunk: function () {
        return this.hits === this.length;
    }

}

var battleship = {
    //Game board and status members
    board: [],
    status: " ", 

    initialize: function () {
        //Initalize an 10x10 empty board every time game is started or restarted
        this.board = []
        for (let i = 0; i < boardYLength; i++) {
            //Creates the rows on the board
            const row = [];
            for (let j = 0; j < boardXLength; j++) {
                //Creates the column on the board
                row.push(" ");
            }
            this.board.push(row);
        }
        return this.board;
    },

    randomCoordinates: function () {
        //Generates a random number between 0 and 9
        var randomX = Math.floor((Math.random() * (boardXLength)));
        var randomY = Math.floor((Math.random() * (boardYLength)));

        //Returns the Y coordinate in the rows and the X coordinate in the columns
        return [randomY, randomX];
    },

    randomOrientation: function () {
        //Randomizes a number between 0 and 1
        const randomNumber = Math.random();

        if (randomNumber < 0.5) {
            return "x"; // Horizontal orientation
        } else {
            return "y"; // Vertical orientation
        }
    },

    canIPlaceShip: function (coordinates, orientation, size) {
        //Get the columns coordinate from the array
        const xCoord = coordinates[1];
        //Get the rows coordinates from the array
        const yCoord = coordinates[0];

        //Checks if vessel is about to be places out of bounds or overlap another vessel
        for (let i = 0; i < size; i++) {
            if (
                (orientation === "x" && (xCoord + i >= boardXLength || this.board[yCoord][xCoord + i] !== " ")) ||
                (orientation === "y" && (yCoord + i >= boardYLength || this.board[yCoord + i][xCoord] !== " "))
            ) {
                return false;
            }
        }
        // If all checks pass, the ship can be placed
        return true;
    },

    putShip: function (ship) {
        const shipName = ship.getName(); //Assigns the ship name
        const shipSize = ship.getLength(); //Assigns the ship length
        const shipOrientation = ship.getOrientation(); //Assigns the ship orientation

        let placed = false; // Boolean to check if ship is placed on the board 

        // Keep trying to place the ship until it's successfully placed
        while (!placed) {
            const coordinates = this.randomCoordinates(); //Generates random coordinate to place the ship

            // Check if it's possible to place the ship at the generated coordinates
            if (this.canIPlaceShip(coordinates, shipOrientation, shipSize)) {
                const [yCoord, xCoord] = coordinates;
               
                // Place the ship on the board based on its orientation (x for horizontal, y for vertical)
                for (let i = 0; i < shipSize; i++) {
                    if (shipOrientation === "x") {
                        this.board[yCoord][xCoord + i] = shipName; //Places the ship in the same row horizontally
                    } else {
                        this.board[yCoord+ i][xCoord] = shipName; //Places the ship in the same column vertically
                    }
                }
                placed = true; // Ship is placed and exits the while loop
            }
        }
    },
    createShips: function () {
        // Initialize an empty array to store ship objects so that it can track hits on each ship individually
        this.allVessels = [];

        //Creates all different ships in the vessels array that exists and set their attributes
        for (let i = 0; i < vessels.length; i++) {
            const newShip = Object.create(ship);
            newShip.setName(vessels[i][vesselName]);
            newShip.setLength(vessels[i][vesselLength]);
            newShip.setOrientation(this.randomOrientation());

            // Use the putShip function to randomly place the ship on the game board
            this.putShip(newShip)

            // Add the newly created ship to the array of ships
            this.allVessels.push(newShip);
        }
    },
    makeMove: function (coordinates) {
        const xCoord = coordinates[1]; //Get the columns coordinate from the array
        const yCoord = coordinates[0]; //Get the rows coordinates from the array
        const cell = this.board[yCoord][xCoord]; //Gets the value from the 2D array

        //Missed the vessel 
        if (cell === " ") {
            //Message displayed in message div
            addMessage("You missed!");
            //Adds an M to the clicked cell
            markBox(coordinates, "M")
            //Update the status to missed
            this.status = "missed";
            return "missed";
        }
        else {
            //Gets the vessel that was hit from the ships array and retrieves it name
            const shipObject = this.allVessels.find(ship => ship.getName() === cell);

            if (shipObject) {
                shipObject.incrementHits(); // Track the hit on the specific ship

                //Checks if the ship is sunk or hit after the cell has been clicked
                if (shipObject.getHits() === shipObject.getLength()) {
                    addMessage(`You sunk the ${shipObject.getName()}`);
                    this.status = "sunk";
                    if(this.sunkenShips() === true){
                        addMessage("gameover");
                        this.status = "gameover"
                        sendStatusURL(this.status) //Send the gameover status to reset player score in their route
                    }
                } else {
                    addMessage(`You hit the ${shipObject.getName()}!`);
                    this.status = "hit"
                }
                return shipObject.getName(); //Return the name of vessle to be able to update the game board with their class
            }
        }
    },



    //Checks if all ships are sunken in the ships array to determine if the game is over.
    sunkenShips: function () {
        for (let i = 0; i < this.allVessels.length; i++) {
            if (!this.allVessels[i].isSunk()) {
                return false;
            }
        }
        return true;
        
    }
};

//Function that makes a AJAX call to their specific route to send current status after a move and update their score accordingly
function sendStatusURL(status, coordiantes){
    username = gamePlay.getUsername(); // gets username
    var url = new URL(player2Route); // creates a new url
    var parameter = url.searchParams;
    //append the parameters to new url
    parameter.set('status', status); 
    parameter.set('move', coordiantes);
    parameter.set('username', username);
    
    fetch(url)
        .then(response => {
            return response;
        })
        .catch(err =>{
            console.log(err);
        })

}

