// Select the player score element and the HIT button
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const pathname = window.location.pathname;  // Get the full path
const username = pathname.split('/')[2];  // Replace with a dynamic value if needed
const youLoseElement = document.getElementById("youlose")
const youWinElement = document.getElementById("youwin")
const drawElement = document.getElementById("draw")
const charlieWinElement = document.getElementById("charlieWin")
const cheatSheetButton = document.getElementById("cheat-sheet-button");
const cheatSheetPic = document.getElementById("cheat-sheet-pic");
const againButton = document.getElementById("AGAIN");
const chanceOfWinning = 42; // %
const percentNeededToBeatHouse = 50; // %
const dealersTotalElement = document.getElementById("dealersHandTotal");
const playersTotalElement = document.getElementById("playersHandTotal");
const winPercentageElement = document.getElementById("win-percentage-num");
const totalGamesElement = document.getElementById("total-games-num");
const endGameMessage = "stopHandingCards"
const continueGameMessage = "continueHandingCards"
const ResetStatsButton = document.getElementById("reset-stats-btn");

console.log("Script loaded");


function CheckOutcome(outcome) {
    if (outcome == "win") {
        winOccurance();
        return "win"
    } else if (outcome == "loss") {
        lossOccurance();
        return "loss"
    } else if (outcome == "draw") {
        drawOccurance()
        return "draw"
    } else if (outcome == "Charlie-win") {
        charlieWinOccurance();
        return "Charlie-win"
    } else if (outcome == "continue") {
        return "continue"
    } else {
        throw new Error("check outcome not working")
    }
}

async function generatePlayerCard() {
    // calls api that updates database current player hand and retrieves the card pic along with it
    const response = await fetch("/api/" + username + "/playerCard");
    if (!response.ok) throw new Error("Failed to fetch player card route");
    const data = await response.json();
    console.log(data)

    // Check if the response contains the required fields
    if (!data.outcome) {
        throw new Error("Invalid JSON data: missing outcome");
    }
    if(!data.cardPic) {
        throw new Error("Invalid JSON data: missing cardPic")
    }

    return data;
}

async function generateDealerCard() {
    // calls api that updates database current dealer hand and retrieves the card pic along with it
    const response = await fetch("/api/" + username + "/dealerCard");
    if (!response.ok) throw new Error("Failed to fetch dealer card route");
    const data = await response.json();
    console.log(data)

    // Check if the response contains the required fields
    if (!data.outcome) {
        throw new Error("Invalid JSON data: missing outcome");
    }
    if(!data.cardPic) {
        throw new Error("Invalid JSON data: missing cardPic")
    }
    
    return data;
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
        // calls api that updates database current dealer hand and retrieves the card pic and outcome
        const data = await generateDealerCard();
        const newCardPic = data.cardPic 

        const outcome = CheckOutcome(data.outcome);

        // retrives newly created card data from dealer stats api
        const numberOfCardsInDealersHand = await updateDealerHand();

        const dealerCardElement = document.getElementById(`dealer-card-${numberOfCardsInDealersHand}-pic`);

        if (dealerCardElement) {
            dealerCardElement.src = newCardPic
            dealerCardElement.style.display = "block";
        } else {
            console.error(`Element with ID card-${numberOfCardsInDealersHand}-pic not found in the DOM.`);
        }

        if (outcome == "continue") { // ensure neither player nor dealer has caused an ending
            return continueGameMessage
        } else {
            return endGameMessage
        }


        
    } catch (error) {
        console.error("Error updating dealer card:", error);
    }
}

async function givePlayerCard() {
    try {
        // calls api that updates database current player hand and retrieves the card pic and outcome
        const data = await generatePlayerCard();
        const newCardPic = data.cardPic 

        const outcome = CheckOutcome(data.outcome);

        // retrives newly created card data from player stats api
        const numberOfCardsInPlayersHand = await updatePlayerHand();

        // uses card data to update browser player total number and give new catd pic
        const playerCardElement = document.getElementById(`card-${numberOfCardsInPlayersHand}-pic`);

        if (playerCardElement) {
            playerCardElement.src = newCardPic;
            playerCardElement.style.display = "block";
        } else {
            console.error(`Element with ID card-${numberOfCardsInPlayersHand}-pic not found in the DOM.`);
        }

        if (outcome == "continue") {
            return continueGameMessage
        } else {
            return endGameMessage
        }

    } catch (error) {
        console.error("Error in givePlayerCard:", error);
    }
}

async function updatePlayerHand() {
    try {
        const response = await fetch("/api/" + username + "/currentPlayerStats"); 
        if (!response.ok) throw new Error("Failed to fetch currentPlayerStats");
        const data = await response.json();
        if (!data || typeof data.numberOfCardsInPlayersHand !== "number") {
            throw new Error("Invalid data format for currentPlayerStats");
        }
        console.log("Player Stats:", data);
        const numberOfCardsInPlayersHand = data.numberOfCardsInPlayersHand
        const currentPlayerHand = data.currentPlayerHand;

        // uses card data to update browser player total number
        playersTotalElement.textContent = currentPlayerHand;
        return numberOfCardsInPlayersHand;

    } catch (err) {
        console.error("Error retrieving currentPlayerStats:", err);
    }
}

async function updateDealerHand() {
    try {
        const response = await fetch("/api/" + username + "/currentDealerStats"); 
        if (!response.ok) throw new Error("Failed to fetch currentDealerStats");
        const data = await response.json();
        if (!data || typeof data.numberOfCardsInDealersHand !== "number") {
            throw new Error("Invalid data format for currentDealerStats");
        }
        console.log("Dealer Stats:", data);
        const numberOfCardsInDealersHand = data.numberOfCardsInDealersHand
        const currentDealerHand = data.currentDealerHand;

        // uses card data to update browser dealers total number and give new catd pic
        dealersTotalElement.textContent = currentDealerHand;
        return numberOfCardsInDealersHand

    } catch (err) {
        console.error("Error retrieving currentDealerStats:", err);
    }
}

async function getDealerHand(){
    const response = await fetch("/api/" + username + "/currentDealerStats"); 
    if (!response.ok) throw new Error("Failed to fetch currentDealerStats");
    const data = await response.json();
    if (!data || typeof data.numberOfCardsInDealersHand !== "number") {
        throw new Error("Invalid data format for currentDealerStats");
    }
    return data.numberOfCardsInDealersHand
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
    againButton.style.display = "block"
}

async function winOccurance() {
    youWinElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    againButton.style.display = "block"
}

async function drawOccurance() {
    drawElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    againButton.style.display = "block"
}

async function charlieWinOccurance() {
    charlieWinElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
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
    fetchTotalGames(username)

    // Cheat sheet Consistency on page reload
    sendCheatSettingToBrowser();

    hitButton.style.display = "block"
    standButton.style.display = "block"

});

// Fetch and display win percentage
async function fetchWinPercentage(username) {
    try {
        const response = await fetch(`/api/${username}/winPercentage`);
        if (!response.ok) throw new Error(`Error fetching win percentage: ${response.status}`);

        const data = await response.json();
        console.log(data)
        const winPercentage = data.winPercentage.toFixed(2); // Format to 2 decimal places

        // change win percentage colour based on its number
        if (winPercentage < chanceOfWinning) {
            winPercentageElement.style.color = "red"

        } else if (winPercentage < percentNeededToBeatHouse && winPercentage >= chanceOfWinning) {
            winPercentageElement.style.color = "orange"

        } else {
            winPercentageElement.style.color = "lightblue"
        }

        // Update the HTML with the win percentage
        winPercentageElement.innerText = winPercentage;
    } catch (error) {
        console.error("Error fetching win percentage:", error);
        document.getElementById("win-percentage").innerText = "N/A";
    }
}

async function fetchTotalGames(username) {
    try {
        const response = await fetch(`/api/${username}/gamesPlayed`);
        if (!response.ok) throw new Error(`Error fetching games played: ${response.status}`);

        const data = await response.json();
        console.log(data)
        const gamesPlayed = data.gamesPlayed; 

        // Update the HTML with the win percentage
        totalGamesElement.innerText = gamesPlayed;
    } catch (error) {
        console.error("Error fetching win percentage:", error);
        document.getElementById("win-percentage").innerText = "N/A";
    }
}

// Add an event listener for the HIT button
hitButton.addEventListener("click", async () => {
    try {
        hitButton.style.display = "none"
        standButton.style.display = "none"

        // call index.js give player card function
        await givePlayerCard();

        hitButton.style.display = "block"
        standButton.style.display = "block"
    } catch (err) {
        console.error("hit button error", err);
    }
});

standButton.addEventListener("click", async () => {
    try {
        hitButton.style.display = "none"
        standButton.style.display = "none"
        

        while (true) { // indefinte while loop
            if (await giveDealerCard() == endGameMessage) {
                break;
            }
        }

    } catch (err) {
        console.error("Error with stand button", err);
    }
});

ResetStatsButton.addEventListener("click", async () => {
    try {

        try {
            await fetch("/api/" + username + "/resetGamesPlayed", { method: "POST" });
            location.reload();
        } catch (err) {
            console.error("Error calling resetGamesPlayed API:", err);
        }

    } catch (err) {
        console.error("Error with Reset Stats button", err);
    }
})

cheatSheetButton.addEventListener("click", async() => {
    try {
        await fetch("/api/" + username + "/toggleCheats", { method: "POST" }); // toggle cheats sheets in the mongoDB database

        sendCheatSettingToBrowser();
    } catch (err) {
        console.error("cheat sheet button error")
    }
});




