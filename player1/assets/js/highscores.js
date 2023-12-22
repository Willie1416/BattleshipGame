
const highscores = "http://127.0.0.1:3000/highscores"

//uses fetch to make a request to the username route that returns top 10 scores 
fetch(highscores)
.then(response =>{
    return response.json()
})
.then(data =>{
    createHighscores(data) // calls createHighscores() with the data returned from the request to create a table in index.html
} )
.catch(err =>{
    console.error(err);// catches any error that would occur
})

function createHighscores(data){
    const table = document.getElementById("tableBody") // access the table body in index.html
    
    // Loops through each item returned from the database and creates a row with username and their highscore
    data.forEach(item => {
        const row = document.createElement('tr');
        const name = document.createElement('td');
        name.textContent = item.username
        const score = document.createElement('td');
        score.textContent = item.score
        row.appendChild(name);
        row.appendChild(score);
        table.appendChild(row);
    })
}

