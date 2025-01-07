// Select the player score element and the HIT button
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const username = "pfen"; // Replace with a dynamic value if needed
const youLoseElement = document.getElementById("youlose")
const youWinElement = document.getElementById("youwin")
const cheatSheetButton = document.getElementById("cheat-sheet-button");
const cheatSheetPic = document.getElementById("cheat-sheet-pic");
let hits = 0;
const lossWaitDuration = 500; //ms
const winWaitDuration = 700; //ms
// const card1Pic = document.getElementById("card-one-pic");
// const card2Pic = document.getElementById("card-two-pic");
// const card3Pic = document.getElementById("card-three-pic");
// const card4Pic = document.getElementById("card-four-pic");
// const card5Pic = document.getElementById("card-five-pic");
const chanceOfWinning = 42; // %
const chanceOfBeatingTheHouse = 50; // %


function getCardPic(cardNum) {
    // Generate a random suit (1 to 4)
    const suit = Math.floor(Math.random() * 4) + 1;
    // Define suits and file naming convention
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const suitName = suits[suit - 1]; // Map suit number to name

    const tenType = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
    // Define tenType and file naming convention
    const tenTypes = ["10", "jack", "queen", "king"];
    const tenName = tenTypes[tenType - 1]; // Map ten to name

    // Handle card numbers and return appropriate file name
    switch (cardNum) {
        case 1:
            return `/PNG-cards-1.3/ace_of_${suitName}.png`;
        case 2:
            return `/PNG-cards-1.3/2_of_${suitName}.png`;
        case 3:
            return `/PNG-cards-1.3/3_of_${suitName}.png`;
        case 4:
            return `/PNG-cards-1.3/4_of_${suitName}.png`;
        case 5:
            return `/PNG-cards-1.3/5_of_${suitName}.png`;
        case 6:
            return `/PNG-cards-1.3/6_of_${suitName}.png`;
        case 7:
            return `/PNG-cards-1.3/7_of_${suitName}.png`;
        case 8:
            return `/PNG-cards-1.3/8_of_${suitName}.png`;
        case 9:
            return `/PNG-cards-1.3/9_of_${suitName}.png`;
        case 10:
            return `/PNG-cards-1.3/${tenName}_of_${suitName}.png`
        default:
            return "/PNG-cards-1.3/invalid_card.png"; // Return a default for invalid card numbers
    }
}

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

async function sendCheatSettingToBrowser() {
    const response = await fetch("/api/" + username + "/toggleCheats", { method: "GET" }) // get the current toggle setting just changed
    const data = await response.json();
    const cheatsToggle = data.cheatSheetToggle;
    if (cheatsToggle == true) { // if the cheats were toggled on as seen in the database
        cheatSheetPic.style.display = "block" // display cheatSheet
    } else {
        cheatSheetPic.style.display = "none" // close display cheatSheet
    }
}

async function lossOccurance() {
    hits = 0;
    youLoseElement.style.display = "block"
    standButton.style.display = "none"
    hitButton.style.display = "none"
    await fetch("/api/" + username + "/loss", { method: "POST" });
    await delay(lossWaitDuration) 
    await resetHands();
    location.reload();
}

async function winOccurance() {
    hits = 0;
    youWinElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    await fetch("/api/" + username + "/win", { method: "POST" });
    await delay(winWaitDuration);
    await resetHands();
    location.reload();
}

// on page load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/" + username + "/currentHands"); 
        if (!response.ok) throw new Error("Failed to fetch current hands");

        const data = await response.json();

        // Update the values in the HTML
        // playerScoreElement.textContent = data.playerCurrentHand;
        // dealerScoreElement.textContent = data.dealerCurrentHand;
    } catch (error) {
        console.error("Error fetching current hands:", error);
    }

    // Fetch and display win percentage
    fetchWinPercentage(username);

    // display username
    document.getElementById("username").innerText = "username: " + username;

    // Cheat sheet Consistency on page reload
    sendCheatSettingToBrowser();


});

// Fetch and display win percentage
async function fetchWinPercentage(username) {
    try {
        const response = await fetch(`/api/${username}`);
        if (!response.ok) throw new Error(`Error fetching win percentage: ${response.status}`);

        const data = await response.json();
        const winPercentage = data.winPercentage.toFixed(2); // Format to 2 decimal places

        // change win percentage colour based on its number
        if (winPercentage < chanceOfWinning) {
            document.getElementById("win-percentage-num").style.color = "red"

        } else if (winPercentage < chanceOfBeatingTheHouse && winPercentage >= chanceOfWinning) {
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

            hits++;

            // Fetch the updated player card
            const playerCardResponse = await fetch("/api/" + username + "/playerCard");
            if (!playerCardResponse.ok) throw new Error("Failed to fetch player card");

            const playerCardData = await playerCardResponse.json();
            console.log("Player card data:", playerCardData); // Debugging line

            // playerScoreElement.textContent = playerCardData.card;
            let newCardPic = getCardPic(playerCardData.card)
            document.getElementById(`card-${hits}-pic`).src = newCardPic;
            document.getElementById(`card-${hits}-pic`).style.display = "block";

            const response = await fetch("/api/" + username + "/currentHands"); 
            if (!response.ok) throw new Error("Failed to fetch current hands");
            const data = await response.json();
            playerCurrentHand = data.playerCurrentHand;
    

            if (playerCurrentHand > 21) { 
                lossOccurance();

            } else if (hits == 5) {
                winOccurance(); // if after 5 hits the hand is less than 21 insta win (5-Card Charlie rule)

            } else {
                // Fetch the updated dealer card
                const dealerCardResponse = await fetch("/api/" + username + "/dealerCard");
                if (!dealerCardResponse.ok) throw new Error("Failed to fetch dealer card");

                const dealerCardData = await dealerCardResponse.json();
                
                // dealerScoreElement.textContent = dealerCardData.card;

                // retrieve the total of the current Dealers hand after the new card has been introduced
                const response = await fetch("/api/" + username + "/currentHands"); 
                if (!response.ok) throw new Error("Failed to fetch current hands");
                const data = await response.json();
                dealerCurrentHand = data.dealerCurrentHand;

                if (dealerCurrentHand > 21) {   // see if the dealers hand is allowed
                    winOccurance();
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

        sendCheatSettingToBrowser();
    } catch (err) {
        console.error("cheat sheet button error")
    }
});




