// Select the player score element and the HIT button
const playerScoreElement = document.getElementById("player");
const dealerScoreElement = document.getElementById("dealer");
const hitButton = document.getElementById("hit");
const username = "pfen"; // Replace with a dynamic value if needed
const youLoseElement = document.getElementById("youlose")

// Fetch current hand values on page load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/" + username + "/currentHands"); // Corrected string interpolation
        if (!response.ok) throw new Error("Failed to fetch current hands");

        const data = await response.json();

        // Update the values in the HTML
        playerScoreElement.textContent = data.playerCurrentHand;
        dealerScoreElement.textContent = data.dealerCurrentHand;
    } catch (error) {
        console.error("Error fetching current hands:", error);
    }

    // Fetch and display win percentage
    fetchWinPercentage(username);
});

// Fetch and display win percentage
async function fetchWinPercentage(username) {
    try {
        const response = await fetch(`/api/${username}`);
        if (!response.ok) throw new Error(`Error fetching win percentage: ${response.status}`);

        const data = await response.json();
        const winPercentage = data.winPercentage.toFixed(2); // Format to 2 decimal places

        // Update the HTML with the win percentage
        document.getElementById("win-percentage").innerText = `${winPercentage}%`;
    } catch (error) {
        console.error("Error fetching win percentage:", error);
        document.getElementById("win-percentage").innerText = "N/A";
    }
}

// Add an event listener for the HIT button
if (hitButton) {
    hitButton.addEventListener("click", async () => {
        try {
            // Fetch the updated player card
            const playerCardResponse = await fetch("/api/" + username + "/playerCard");
            if (!playerCardResponse.ok) throw new Error("Failed to fetch player card");

            const playerCardData = await playerCardResponse.json();
            console.log("Player card data:", playerCardData); // Debugging line

            if (playerCardData.card === "BUST") {
                youLoseElement.style.display = "block"
            }
            playerScoreElement.textContent = playerCardData.card;

            // Fetch the updated dealer card
            const dealerCardResponse = await fetch("/api/" + username + "/dealerCard");
            if (!dealerCardResponse.ok) throw new Error("Failed to fetch dealer card");

            const dealerCardData = await dealerCardResponse.json();
            dealerScoreElement.textContent = dealerCardData.card;
        } catch (err) {
            console.error("Error updating scores:", err);
        }
    });
} else {
    console.error("HIT button not found in the DOM.");
}
