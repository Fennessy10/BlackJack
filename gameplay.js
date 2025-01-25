const express = require("express");
const router = express.Router(); // Use router to create modular routes
const User = require("./models/User");

let playerCurrentHand = 0;
let dealerCurrentHand = 0;
let dealerAceCount = 0;
let playerAceCount = 0;
let numberOfCardsInPlayersHand = 0;
let numberOfCardsInDealersHand = 0;

function adjustForAces(handTotal, aceCount) {
    console.log("player ace count: " + playerAceCount);
    while (handTotal > 21 && aceCount > 0) { // aceCount is used as a regular in-function while-loop count 
        handTotal -= 10; // Reduce Ace from 11 to 1
        aceCount--; // this inner-function decrement does not effect the global variable input (i.e playerAceCount or dealerAceCount)
    }
    return handTotal;  // only returns the handTotal as this is the only thing that needs updating (not the aceCount)
}

async function winOccurance() {
    try {
        console.log("Username in gameplay route:", req.params.username);
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { wins: 1 } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json({ message: "Win updated successfully.", user });
    } catch (err) {
        console.error("Error updating win:", err);
        res.status(500).json({ error: "An error occurred while updating win." });
    }
}

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

function checkPlayersHand() {
    if (playerCurrentHand > 21) { 
        const playerAdjustedValues = adjustForAces(playerCurrentHand, playerAceCount);
        playerCurrentHand = playerAdjustedValues;
        console.log("ace(s) adjusted. player current total: " + playerCurrentHand);
        playersTotalElement.textContent = playerCurrentHand;

        if (playerCurrentHand > 21) {
            lossOccurance();
        } 
    } 
    if (numberOfCardsInPlayersHand == 5) {
        winOccurance(); // if after 5 hits the hand is less than 21 insta win (5-Card Charlie rule)

    } 
}

async function checkDealersHand() {
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
}

// Helper function to get a random card for the player
function addPlayerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    playerCurrentHand += addedCard;
    return addedCard;
}

// Helper function to get a random card for the dealer
function addDealerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    dealerCurrentHand += addedCard;
    return addedCard;
}

// Route to serve a random card for the player
router.get("/playerCard", (req, res) => {
    try {
        const card = addPlayerCard();
        res.json({ card });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while getting a player card." });
    }
});

// Route to serve a random card for the dealer
router.get("/dealerCard", (req, res) => {
    try {
        const card = addDealerCard();
        res.json({ card });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while getting a dealer card." });
    }
});

// Route to get the current hands for both player and dealer
router.get("/currentHands", (req, res) => {
    res.json({
        playerCurrentHand: playerCurrentHand,
        dealerCurrentHand: dealerCurrentHand,
    });
});

// Route to reset hands for both player and dealer
router.post("/resetHands", (req, res) => {
    try {
        playerCurrentHand = 0;
        dealerCurrentHand = 0;
        dealerAceCount = 0;
        playerAceCount = 0;
        numberOfCardsInPlayersHand = 0;
        numberOfCardsInDealersHand = 0;

        res.json({ message: "Hands have been reset." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while resetting hands." });
    }
});

// Route to update wins
router.post("/win", async (req, res) => {
    winOccurance();
});

// Route to update losses
router.post("/loss", async (req, res) => {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { losses: 1 } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json({ message: "Loss updated successfully.", user });
    } catch (err) {
        console.error("Error updating loss:", err);
        res.status(500).json({ error: "An error occurred while updating loss." });
    }
});






module.exports = { router };
