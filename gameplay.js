const express = require("express");
const router = express.Router(); // Use router to create modular routes

let currentPlayerHand = 0;
let currentDealerHand = 0;

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

// Helper function to get a random card for the player
function addPlayerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    currentPlayerHand += addedCard;

    if (currentPlayerHand <= 21) {
        return currentPlayerHand;
    } else {
        currentPlayerHand = 0;
        return "BUST";
    }
}

// Helper function to get a random card for the dealer
function addDealerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    currentDealerHand += addedCard;

    if (currentDealerHand <= 21) {
        return currentDealerHand;
    } else {
        currentDealerHand = 0;
        return "BUST";
    }
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
        playerCurrentHand: currentPlayerHand,
        dealerCurrentHand: currentDealerHand,
    });
});

module.exports = { router };
