// Select the player score element and the HIT button
const playerScoreElement = document.getElementById("player");
const dealerScoreElement = document.getElementById("dealer");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const username = "pfen"; // Replace with a dynamic value if needed
const youLoseElement = document.getElementById("youlose")
const youWinElement = document.getElementById("youwin")
const cheatSheetButton = document.getElementById("cheat-sheet-button");
const cheatSheetPic = document.getElementById("cheat-sheet-pic");

// delay utility function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resetHands() {
    try {
        const response = await fetch("/api/" + username + "/resetHands", { method: "POST" });
        if (!response.ok) throw new Error("Failed to reset hands");

        console.log("Hands have been reset.");
    } catch (err) {
        console.error("Error resetting hands:", err);
    }
}

async function changeCheatSetting() {
    const response = await fetch("/api/" + username + "/toggleCheats", { method: "GET" }) // get the current toggle setting just changed
    const data = await response.json();
    const cheatsToggle = data.cheatSheetToggle;
    if (cheatsToggle == true) { // if the cheats were toggled on as seen in the database
        cheatSheetPic.style.display = "block" // display cheatSheet
    } else {
        cheatSheetPic.style.display = "none" // close display cheatSheet
    }
}

// on page load
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

    // display username
    document.getElementById("username").innerText = "username: " + username;

    // Cheat sheet Consistency on page reload
    changeCheatSetting();


});

// Fetch and display win percentage
async function fetchWinPercentage(username) {
    try {
        const response = await fetch(`/api/${username}`);
        if (!response.ok) throw new Error(`Error fetching win percentage: ${response.status}`);

        const data = await response.json();
        const winPercentage = data.winPercentage.toFixed(2); // Format to 2 decimal places

        // change win percentage colour based on its number
        if (winPercentage < 42) {
            document.getElementById("win-percentage-num").style.color = "red"
        } else if (winPercentage < 50 && winPercentage >= 42) {
            document.getElementById("win-percentage-num").style.color = "orange"
        } else {
            document.getElementById("win-percentage-num").style.color = "lightblue"
        }

        // Update the HTML with the win percentage
        document.getElementById("win-percentage-num").innerText = winPercentage;
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

            playerScoreElement.textContent = playerCardData.card;

            if (playerCardData.card === "BUST") {
                youLoseElement.style.display = "block"
                standButton.style.display = "none"
                hitButton.style.display = "none"
                await fetch("/api/" + username + "/loss", { method: "POST" });
                await delay(500)
                await resetHands();
                location.reload();
            } else {
                // Fetch the updated dealer card
                const dealerCardResponse = await fetch("/api/" + username + "/dealerCard");
                if (!dealerCardResponse.ok) throw new Error("Failed to fetch dealer card");

                const dealerCardData = await dealerCardResponse.json();

                dealerScoreElement.textContent = dealerCardData.card;

                if (dealerCardData.card === "BUST") {
                    youWinElement.style.display = "block"
                    hitButton.style.display = "none"
                    standButton.style.display = "none"
                    await fetch("/api/" + username + "/win", { method: "POST" });
                    await delay(700);
                    await resetHands();
                    location.reload();

                }
            }
        } catch (err) {
            console.error("Error updating scores:", err);
        }
    });
} else {
    console.error("HIT button not found in the DOM.");
}

cheatSheetButton.addEventListener("click", async() => {
    try {
        await fetch("/api/" + username + "/toggleCheats", { method: "POST" }); // toggle cheats sheets in the mongoDB database

        changeCheatSetting();
    } catch (err) {
        console.error("cheat sheet button error")
    }
});


