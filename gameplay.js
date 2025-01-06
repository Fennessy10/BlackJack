const express = require("express");
const router = express.Router(); // Use router to create modular routes
const User = require("./models/User");

let currentPlayerHand = 0;
let currentDealerHand = 0;

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

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
            return `ace_of_${suitName}.png`;
        case 2:
            return `2_of_${suitName}.png`;
        case 3:
            return `3_of_${suitName}.png`;
        case 4:
            return `4_of_${suitName}.png`;
        case 5:
            return `5_of_${suitName}.png`;
        case 6:
            return `6_of_${suitName}.png`;
        case 7:
            return `7_of_${suitName}.png`;
        case 8:
            return `8_of_${suitName}.png`;
        case 9:
            return `9_of_${suitName}.png`;
        case 10:
            return `${tenName}_of_${suitName}`
        default:
            return "invalid_card.png"; // Return a default for invalid card numbers
    }
}


// Helper function to get a random card for the player
function addPlayerCard() {
    const possibleHand = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    currentPlayerHand += addedCard;
    return currentPlayerHand;

}

// Helper function to get a random card for the dealer
function addDealerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    currentDealerHand += addedCard;
    return currentDealerHand;

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

// Route to reset hands for both player and dealer
router.post("/resetHands", (req, res) => {
    try {
        currentPlayerHand = 0;
        currentDealerHand = 0;
        res.json({ message: "Hands have been reset." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while resetting hands." });
    }
});

// Route to update wins
router.post("/win", async (req, res) => {
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

router.post("/toggleCheats", async (req, res) => {
    try {
        // Simulate getting the username from the request
        const username = "pfen";

        // Find the user and toggle the cheatSheetToggle value
        const user = await User.findOneAndUpdate(
            { user_name: username },
            [
                // Use MongoDB aggregation pipeline to toggle the value
                { $set: { cheatSheetToggle: { $not: "$cheatSheetToggle" } } }
            ],
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({ message: "Cheats updated successfully.", user });
    } catch (err) {
        console.error("Error updating cheat preference:", err);
        res.status(500).json({ error: "An error occurred while updating cheat preference." });
    }
});

router.get("/toggleCheats", async (req, res) => {
    try {
        const username = "pfen"; // Replace with dynamic username if needed (e.g., from req.params or req.query)

        // Find the user by their username
        const user = await User.findOne({ user_name: username });

        // Handle the case where the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Send the cheatSheetToggle value
        res.json({ cheatSheetToggle: user.cheatSheetToggle });
    } catch (err) {
        console.error("Error fetching cheat preference:", err);
        res.status(500).json({ error: "An error occurred while fetching cheat preference." });
    }
});

router.get("/getCardPic", async (req, res) => {
    try {
        let cardPic = getCardPic()
        res.json({})
    } catch (err) {
        console.error("Error fetching card picture:", err);
        res.status(500).json({ error: "An error occurred while fetching card picture." });
    }
})


module.exports = { router };
