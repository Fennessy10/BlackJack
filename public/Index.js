// Select the player score element and the HIT button
const playerScoreElement = document.getElementById("player");
const hitButton = document.getElementById("hit");

async function fetchWinPercentage(username) {
    try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) {
            throw new Error(`Error fetching win percentage: ${response.status}`);
        }

        const data = await response.json();
        const winPercentage = data.winPercentage.toFixed(2); // Format to 2 decimal places

        // Update the HTML with the win percentage
        document.getElementById('win-percentage').innerText = `${winPercentage}%`;
    } catch (error) {
        console.error(error);
        document.getElementById('win-percentage').innerText = 'N/A';
    }
}

// Add an event listener for the HIT button
hitButton.addEventListener("click", async () => {
    try {
        // Fetch the updated card value from the API
        const response = await fetch("/api/card");
        if (!response.ok) throw new Error("Failed to fetch card data");

        const data = await response.json();

        // Update the player's score in the DOM
        playerScoreElement.textContent = data.card; // Assuming "data.card" contains the updated score
    } catch (err) {
        console.error("Error updating player score:", err);
    }
});


// Call the function with the username
fetchWinPercentage("pfen");


