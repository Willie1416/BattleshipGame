//Adds a given class to an element if it does not have the class. Does nothing otherwise.
function addClass(element, className) {
    if (element.classList)
        element.classList.add(className);
    else if (!hasClass(element, className))
        element.className += " " + className;
}


//Removes a given class from an element if the class has it. Does nothing otherwise.
function removeClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

//Adds a given text (msg) to the message div.
function addMessage(msg) {
    const messageDiv = document.getElementById("messageDiv");
    const isScrolledToBottom = messageDiv.scrollHeight - messageDiv.clientHeight <= messageDiv.scrollTop + 1;
    // Append the new message and creates a new line
    messageDiv.innerHTML += msg + "<br>";
    // If the user is at the bottom of the message div, scroll to show the newest message
    if (isScrolledToBottom) {
        messageDiv.scrollTop = messageDiv.scrollHeight - messageDiv.clientHeight;
    }
}

//ClearMessages – Removes all messages from the message div.
function clearMessages(){
	const messageDiv = document.getElementById("messageDiv")
	messageDiv.innerHTML = " ";

}

//MarkBox(mark) – Adds a mark message to a given game board box
function markBox(element, msg) {
    const table = document.querySelector("#table");
    if (table) {
        const cell = table.rows[element[0] + 1]?.cells[element[1] + 1];
        if (cell) {
            cell.innerHTML = msg;
        }
    }
}

var usernameRoute = 'http://127.0.0.1:3000/username' // Route for the usernames

//Sets the username and sends it to the server using a POST AJAX call
function displayUsername(username) {
    const usernameDisplay = document.getElementById("usernameDisplay");
    usernameDisplay.innerHTML += username;

    var usernameURL = new Request(usernameRoute);

    var fetchParams = {
        method: 'POST',
        headers: {
            'content-Type' : 'application/json',
        },
        body: JSON.stringify({username: username}),
    }
    
    fetch(usernameURL, fetchParams)
    .catch(err=>{
        console.log(err);
    })
}

//Creates a 10x10 table in HTML
function generateTable() {
    var table = document.getElementById("table");
    var xLength = 10;
    var yLength = 10;

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    var headerRow = document.createElement("tr");
    headerRow.innerHTML = '<th></th>';
    //Create the table columns with labels A to J
    for (var i = 0; i < xLength; i++) {
        var columnHeader = document.createElement("th");
        columnHeader.textContent = String.fromCharCode(65 + i); // A to J
        headerRow.appendChild(columnHeader);
    }
    table.appendChild(headerRow);

    // Create the table rows with labels 1 to 10 and data cells
    for (var i = 0; i < yLength; i++) {
        var row = document.createElement("tr");

        var rowLabel = document.createElement("th");
        rowLabel.textContent = i+1 ; //1 to 10
        row.appendChild(rowLabel);

        // Create data cells
        for (var j = 0; j < xLength; j++) {
            var cell = document.createElement("td");
            cell.id =  i + ", " + j;
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}


//Generates a new miniboard everytime a new game is started for the other player
function miniTable() {
    var table = document.getElementById("minitable");
    var xLength = 10;
    var yLength = 10;

    // Clear existing table
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    var headerRow = document.createElement("tr");
    headerRow.innerHTML = '<th></th>';
    // Create the table columns with labels A to J
    for (var i = 0; i < xLength; i++) {
        var columnHeader = document.createElement("th");
        columnHeader.textContent = String.fromCharCode(65 + i); // A to J
        headerRow.appendChild(columnHeader);
    }
    table.appendChild(headerRow);

    // Create the table rows with labels 1 to 10 and data cells
    for (var i = 0; i < yLength; i++) {
        var row = document.createElement("tr");

        var rowLabel = document.createElement("th");
        rowLabel.textContent = i + 1; // 1 to 10
        row.appendChild(rowLabel);

        for (var j = 0; j < xLength; j++) {
            var cell = document.createElement("td");
            cell.id = i + ", " + j;
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

}

function opponentMoves(move){
    var table = document.getElementById("minitable")
    var coordinates = move[0] // Coordiantes that was played
    var style = move[1]; // Class to be added to the cell


    var xCoord = coordinates[0]; // Extract x coordinate
    var yCoord = coordinates[1]; // Extract y coordinate

    var cell = table.rows[xCoord + 1].cells[yCoord + 1]; // Access the specific cell

    if (cell.innerHTML === ""){
        addClass(cell, style)
    }else{
        addMessage("You already played a move here")
    }
}

// Route name that have the coordinates for player 1
var player1Route = 'http://127.0.0.1:3000/player1' 
//Function that makes a request to the opposite player route to retrieve their moves if they already made moves before this player connected
function populateMiniTable() {
    var table = document.getElementById("minitable");
    var xLength = 10;
    var yLength = 10;

    //Check if minitable exist
    if (!table) {
        console.error("minitable not found");
        return;
    }

    //Fetches other players route
    fetch(player1Route)
        .then(response => {
            return response.json();
        })
        .then(data => {
            for (var i = 0; i < yLength; i++) {
                for (var j = 0; j < xLength; j++) {
                    var cell = table.rows[i + 1].cells[j + 1];
                    //Access the coordinates and checks if the cooridnates has already been played by the other user
                    var coordinate = `${i},${j}`;
                    var match = data.find(item => item.gameMove === coordinate);

                    //If the coordinates exist in the data array add a class to the minitable
                    if (match) {
                        addClass(cell, match.gameStatus); // Apply styles based on gameStatus
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching player data:', error);
        });
}









