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
let numberOfCardsInPlayersHand = 0;
let numberOfCardsInDealersHand = 0;
const cardDealingDuration = 800; //ms
const chanceOfWinning = 42; // %
const percentNeededToBeatHouse = 50; // %
const dealersTotalElement = document.getElementById("dealersHandTotal");
const playersTotalElement = document.getElementById("playersHandTotal");
let playerCurrentHand = 0;
let dealerCurrentHand = 0;
let dealerAceCount = 0;
let playerAceCount = 0;




function getCardPic(cardNum, dealerReceival) {
    // Generate a random suit (1 to 4)
    const suit = Math.floor(Math.random() * 4) + 1;
    // Define suits and file naming convention
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const suitName = suits[suit - 1]; // Map suit number to name

    // Handle card numbers and return appropriate file name
    switch (cardNum) {
        case 11:
            if (dealerReceival){
                dealerAceCount++;
            } else {
                playerAceCount++;
            }
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
            const tenType = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
            // Define tenType and file naming convention
            const tenTypes = ["10", "jack", "queen", "king"];
            const tenName = tenTypes[tenType - 1]; // Map ten to name
            return `/PNG-cards-1.3/${tenName}_of_${suitName}.png`
        default:
            return "/PNG-cards-1.3/invalid_card.png"; // Return a default for invalid card numbers
    }
}

// delay utility function
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function giveDealerCard() {
    try {
        numberOfCardsInDealersHand++;
        const dealerCardResponse = await fetch("/api/" + username + "/dealerCard");
        if (!dealerCardResponse.ok) throw new Error("Failed to fetch dealer card");

        let dealerCardData = await dealerCardResponse.json();
        dealerCurrentHand = dealerCardData.card;

        // Update the displayed dealer total in the DOM
        dealersTotalElement.textContent = dealerCurrentHand;

        let newCardPic = getCardPic(dealerCardData.card, true)
        let dealerCardElement = document.getElementById(`dealer-card-${numberOfCardsInDealersHand}-pic`);

        if (dealerCardElement) {
            dealerCardElement.src = newCardPic;
            dealerCardElement.style.display = "block";
            await updateHands();
            dealersTotalElement.textContent = dealerCurrentHand;
            console.log("numberOfCardsInDealersHand: " + numberOfCardsInDealersHand);
            console.log("player current total: " + playerCurrentHand);
        } else {
            console.error(`Element with ID card-${numberOfCardsInDealersHand}-pic not found in the DOM.`);
        }
        
    } catch (error) {
        console.error("Error updating dealer card:", error);
    }
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

async function updateHands() {
    try {
        const response = await fetch("/api/" + username + "/currentHands"); 
        if (!response.ok) throw new Error("Failed to fetch current hands");
        const data = await response.json();
        playerCurrentHand = data.playerCurrentHand;
        dealerCurrentHand = data.dealerCurrentHand;

    } catch (err) {
        console.error("Error updating hands:", err);
    }
}

async function givePlayerCard() {
    try {
        numberOfCardsInPlayersHand++;
        // Fetch the updated player card
        const playerCardResponse = await fetch("/api/" + username + "/playerCard");
        if (!playerCardResponse.ok) throw new Error("Failed to fetch player card");
        const playerCardData = await playerCardResponse.json();
        console.log("Player card data:", playerCardData); // Debugging line

        let newCardPic = getCardPic(playerCardData.card, false);
        const playerCardElement = document.getElementById(`card-${numberOfCardsInPlayersHand}-pic`);
        
        if (playerCardElement) {
            playerCardElement.src = newCardPic;
            playerCardElement.style.display = "block";
            await updateHands();
            playersTotalElement.textContent = playerCurrentHand;
            console.log("numberOfCardsInPlayersHand: " + numberOfCardsInPlayersHand);
            console.log("player current total: " + playerCurrentHand);
        } else {
            console.error(`Element with ID card-${numberOfCardsInPlayersHand}-pic not found in the DOM.`);
        }
    } catch (error) {
        console.error("Error in givePlayerCard:", error);
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
    await fetch("/api/" + username + "/loss", { method: "POST" }); //post a win to the gameplay js file
    await resetHands();
    againButton.style.display = "block"
}

async function winOccurance() {
    youWinElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    await fetch("/api/" + username + "/win", { method: "POST" }); //post a win to the gameplay js file
    await resetHands();
    againButton.style.display = "block"
}

async function drawOccurance() {
    numberOfCardsInDealersHand = 0;
    numberOfCardsInPlayersHand = 0;
    dealerAceCount = 0;
    playerAceCount = 0;
    drawElement.style.display = "block"
    hitButton.style.display = "none"
    standButton.style.display = "none"
    await resetHands();
    againButton.style.display = "block"
}

againButton.addEventListener("click", async () => {
    againButton.style.display = "none"
    location.reload();
})

// on page load
document.addEventListener("DOMContentLoaded", async () => {
    resetHands();
    try {
        if (numberOfCardsInPlayersHand == 0) {
            await giveDealerCard(); // give the dealer 1 card off the rip
            await givePlayerCard();
            await givePlayerCard(); //give player 2 cards off the rip
        }


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
        await givePlayerCard();

        await updateHands();

        playersTotalElement.textContent = playerCurrentHand;


    } catch (err) {
        console.error("Error updating scores:", err);
    }
});

standButton.addEventListener("click", async () => {
    try {
        hitButton.style.display = "none"
        standButton.style.display = "none"

        while (dealerCurrentHand < 17) {
            await delay(cardDealingDuration);
            await giveDealerCard()
            const dealerAdjustedValues = adjustForAces(dealerCurrentHand, dealerAceCount);
            dealerCurrentHand = dealerAdjustedValues;
            dealersTotalElement.textContent = dealerCurrentHand;
            // await updateHands()
        } 


        if (dealerCurrentHand <= 21 && dealerCurrentHand > playerCurrentHand) {
            await lossOccurance();
        } else if (dealerCurrentHand == playerCurrentHand) {
            await drawOccurance();
        } else {
            await winOccurance();
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




