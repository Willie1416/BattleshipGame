//Generates table, minitable and populates the miniboard if the other user has already made any moves
document.addEventListener("DOMContentLoaded", function () {
	generateTable();
	miniTable();
	populateMiniTable()
});

//User clicks on the game board and then take the appropriate actions.
document.querySelector("#table").addEventListener('click', e => {
	const tableElement = e.target;
	if ((tableElement !== null) && (tableElement.tagName.toLowerCase() == "td")) {
		if (tableElement.classList.length > 0){
			addMessage("You already clicked here");
			}
			else{
				//Gets the table row and column that was clicked and decrements with 1 to be able to manipulate the game board
				const rowIndex = tableElement.parentNode.rowIndex -1;
				const columnIndex = tableElement.cellIndex - 1;
				const coordinates = [rowIndex, columnIndex];
	
				//make the move on the board with selected coordinates and returns vessels name that was hit or if it was missed
				var style = battleship.makeMove(coordinates);
	
				addClass(tableElement, style); // updates the cell with missed or specific vessel
	
				sendStatusURL(style,coordinates); // calls the sendStatusURL that make a AJAX request to their player route to update their score
				
				socket.emit('movePlayed', [coordinates, style]); // emits the move to the other users miniboard to update it
				//When the last ship is clicked and sunk it displays Game over
				gamePlay.isGameOver();
			}
	}
});


/*Restarts the game when the restart button is clicked and emits it to the other user to update their miniboard. It also sends
the status to their route to reset the user score and array with coordinates in the server*/
document.querySelector("#restartButton").addEventListener('click', function () {
	gamePlay.reset();
	socket.emit("reset");
	sendStatusURL("reset");

});

//Resets the message div when clear messages is hit
document.querySelector("#clearMessage").addEventListener('click', function () {
	clearMessages();
});







