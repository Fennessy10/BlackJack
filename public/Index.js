// Select the player score element and the HIT button
const playerScoreElement = document.getElementById("player");
const dealerScoreElement = document.getElementById("dealer");
const hitButton = document.getElementById("hit");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/currentHands"); // Fetch current hand values from the server
        const data = await response.json(); // Parse JSON response

        // Update the values in the HTML
        playerScoreElement.textContent = data.playerCurrentHand;
        dealerScoreElement.textContent = data.dealerCurrentHand;
    } catch (error) {
        console.error("Error fetching current hands:", error);
    }
});


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
        const playerCardResponse = await fetch("/api/playerCard");
        if (!playerCardResponse.ok) throw new Error("Failed to fetch card data");

        const playerCardData = await playerCardResponse.json();

        // Update the player's score in the DOM
        playerScoreElement.textContent = playerCardData.card;



        const dealerCardResponse = await fetch("/api/dealerCard");
        if (!dealerCardResponse.ok) throw new Error("Failed to fetch card data");

        const dealerCardData = await dealerCardResponse.json();

        // Update the dealer's score in the DOM
        dealerScoreElement.textContent = dealerCardData.card; 


    } catch (err) {
        console.error("Error updating scores:", err);
    }
});





// Call the function with the username
fetchWinPercentage("pfen");


