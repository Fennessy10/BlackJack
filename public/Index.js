// Select the player score element and the HIT button
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const username = "pfen"; // Replace with a dynamic value if needed
const youLoseElement = document.getElementById("youlose")
const youWinElement = document.getElementById("youwin")
const drawElement = document.getElementById("draw")
const cheatSheetButton = document.getElementById("cheat-sheet-button");
const cheatSheetPic = document.getElementById("cheat-sheet-pic");
const againButton = document.getElementById("AGAIN");
const cardDealingDuration = 800; //ms
const chanceOfWinning = 42; // %
const percentNeededToBeatHouse = 50; // %
const dealersTotalElement = document.getElementById("dealersHandTotal");
const playersTotalElement = document.getElementById("playersHandTotal");



// delay utility function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generatePlayerCard() {
    // calls api that updates database current player hand and retrieves the card pic along with it
    const response = await fetch("/api/" + username + "/playerCard");
    if (!response.ok) throw new Error("Failed to fetch player card route");
    const newCardPic = await response.json();
    if (!newCardPic) {
        throw new Error("card pic json data error");
    }
    return newCardPic;
}

async function resetHands() {
    try {
        await fetch("/api/" + username + "/resetHands", { method: "POST" });

    } catch (err) {
        console.error("Error calling resetHands API:", err);
    }
}

async function giveDealerCard() {
    try {
        const data = await currentDealerStats();

        const numberOfCardsInDealersHand = data.numberOfCardsInDealersHand

        const dealerCardElement = document.getElementById(`dealer-card-${numberOfCardsInDealersHand}-pic`);


        if (dealerCardElement) {
            const response = await fetch("/api/" + username + "/dealerCard"); 
            if (!response.ok) throw new Error("Failed to fetch dealerCardPic");
            dealerCardElement.src = await response.json();

            dealerCardElement.style.display = "block";

            const data = await currentDealerStats()
            dealersTotalElement.textContent = data.currentDealerHand;

            console.log("numberOfCardsInDealersHand: " + numberOfCardsInDealersHand);
        } else {
            console.error(`Element with ID card-${numberOfCardsInDealersHand}-pic not found in the DOM.`);
        }
        
    } catch (error) {
        console.error("Error updating dealer card:", error);
    }
}

async function givePlayerCard() {
    try {
        // calls api that updates database current player hand and retrieves the card pic along with it
        const newCardPic = await generatePlayerCard();

        // retrives newly created card data from player stats api
        const data = await currentPlayerStats();
        const numberOfCardsInPlayersHand = data.numberOfCardsInPlayersHand
        const currentPlayerHand = data.currentPlayerHand;

        // uses card data to update browser player total number and give new catd pic
        playersTotalElement.textContent = currentPlayerHand;
        const playerCardElement = document.getElementById(`card-${numberOfCardsInPlayersHand}-pic`);

        if (playerCardElement) {
            playerCardElement.src = newCardPic;
            playerCardElement.style.display = "block";
        } else {
            console.error(`Element with ID card-${numberOfCardsInPlayersHand}-pic not found in the DOM.`);
        }
    } catch (error) {
        console.error("Error in givePlayerCard:", error);
    }
}


// async function currentHands() {
//     try {
//         const response = await fetch("/api/" + username + "/currentHands"); 
//         if (!response.ok) throw new Error("Failed to fetch current hands");
//         const data = await response.json();
//         playersTotalElement.textContent = data.playerCurrentHand;
//         dealersTotalElement.textContent = data.dealerCurrentHand;


//         const playerCardElement = document.getElementById(`dealer-card-${data.numberOfCardsInPlayersHand}-pic`);
//         if (playerCardElement) {
//             console.log("numberOfCardsInPlayersHand: " + data.numberOfCardsInPlayersHand);
//         } else {
//             console.error(`Element with ID card-${numberOfCardsInPlayersHand}-pic not found in the DOM.`);
//         }

//     } catch (err) {
//         console.error("Error updating hands:", err);
//     }
// }

async function currentPlayerStats() {
    try {
        const response = await fetch("/api/" + username + "/currentPlayerStats"); 
        if (!response.ok) throw new Error("Failed to fetch currentPlayerStats");
        const data = await response.json();
        if (!data || typeof data.numberOfCardsInPlayersHand !== "number") {
            throw new Error("Invalid data format for currentPlayerStats");
        }
        console.log("Player Stats:", data);
        return data

    } catch (err) {
        console.error("Error retrieving currentPlayerStats:", err);
    }
}

async function currentDealerStats() {
    try {
        const response = await fetch("/api/" + username + "/currentDealerStats"); 
        if (!response.ok) throw new Error("Failed to fetch currentDealerStats");
        const data = await response.json();
        if (!data || typeof data.numberOfCardsInDealersHand !== "number") {
            throw new Error("Invalid data format for currentDealerStats");
        }
        console.log("Dealer Stats:", data);
        return data

    } catch (err) {
        console.error("Error retrieving currentDealerStats:", err);
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
    youLoseElement.style.display = "block"
    standButton.style.display = "none"
    hitButton.style.display = "none"
    // await fetch("/api/" + username + "/loss", { method: "POST" }); //post a win to the gameplay js file
    // await currentHands();
    againButton.style.display = "block"
}

async function winOccurance() {
    youWinElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    // await fetch("/api/" + username + "/win", { method: "POST" }); //post a win to the gameplay js file
    // await currentHands();
    againButton.style.display = "block"
}

async function drawOccurance() {
    drawElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    // await currentHands();
    againButton.style.display = "block"
}

againButton.addEventListener("click", async () => {
    againButton.style.display = "none"
    location.reload();
})

// on page load
document.addEventListener("DOMContentLoaded", async () => {
    await resetHands();

    await giveDealerCard(); // give the dealer 1 card off the rip
    await givePlayerCard();
    await givePlayerCard(); //give player 2 cards off the rip

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

        } else if (winPercentage < percentNeededToBeatHouse && winPercentage >= chanceOfWinning) {
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
hitButton.addEventListener("click", async () => {
    try {
        // call index.js give player card function
        await givePlayerCard();

    } catch (err) {
        console.error("hit button error", err);
    }
});

standButton.addEventListener("click", async () => {
    try {
        hitButton.style.display = "none"
        standButton.style.display = "none"

        // currentHands();

        while (dealersTotalElement.textContent < 17) {
            await delay(cardDealingDuration);
            await giveDealerCard();
        } 

    } catch (err) {
        console.error("Error with stand button", err);
    }
});

cheatSheetButton.addEventListener("click", async() => {
    try {
        await fetch("/api/" + username + "/toggleCheats", { method: "POST" }); // toggle cheats sheets in the mongoDB database

        sendCheatSettingToBrowser();
    } catch (err) {
        console.error("cheat sheet button error")
    }
});




