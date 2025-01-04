const express = require("express");
const router = express.Router(); // Use router to create modular routes
const User = require("./models/User");

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


module.exports = { router };
