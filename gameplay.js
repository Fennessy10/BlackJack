const express = require("express");
const router = express.Router(); // Use router to create modular routes
const User = require("./models/User");

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
            console.error("user not found")
        }
        console.log("win updated successfully")
    } catch (err) {
        console.error("Error updating win:", err);
    }
}

function getCardPic(cardNum) {
    // Generate a random suit (1 to 4)
    const suit = Math.floor(Math.random() * 4) + 1;
    // Define suits and file naming convention
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const suitName = suits[suit - 1]; // Map suit number to name

    // Handle card numbers and return appropriate file name
    switch (cardNum) {
        case 11:
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

function createRandomCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    return addedCard;
}


async function incrementNumberOfDealersCards() {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { numberOfCardsInDealersHand: 1 } },
            { new: true }
        );
        if (!user) {
            console.error("user not found")
        }
    } catch (err) {
        console.error("Error incrementing number of cards in the dealers hand: ", err);
    }
}

async function incrementNumberOfPlayersCards() {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { numberOfCardsInPlayersHand: 1 } },
            { new: true }
        );
        if (!user) {
            console.error("user not found")
        }
    } catch (err) {
        console.error("Error incrementing number of cards in the players hand: ", err);
    }
}

async function incrementDealersAceCount() {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { dealerAceCount: 1 } },
            { new: true }
        );
        if (!user) {
            console.error("user not found ", err);
        }
        console.log("incrementing number of aces in the dealers hand successful")
    } catch (err) {
        console.error("Error incrementing number of aces in the dealers hand: ", err);
    }
}

async function incrementPlayersAceCount() {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { playerAceCount: 1 } },
            { new: true }
        );
        if (!user) {
            console.error("User not found.")
        }
        console.error("incrementing number of aces in the players hand successful")
    } catch (err) {
        console.error("Error incrementing number of aces in the players hand: ", err);
    }
}


async function addValueToDealersHand(addedValue) {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { currentDealerHand: addedValue } },
            { new: true }
        );
        if (!user) {
            console.error("user not found")
        }
        console.log("added value to Players hand successfully")
    } catch (err) {
        console.error("Error attempting to add value to dealers hand ", err);
    }
}

async function addValueToPlayersHand(addedValue) {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { currentPlayerHand: addedValue } },
            { new: true }
        );
        if (!user) {
            console.error("user not found")
        }
        console.log("added value to Players hand successfully")
    } catch (err) {
        console.error("Error attempting to add value to Players hand ", err);
    }
}

// Helper function to get a random card for the dealer
async function addDealerCard() {
    try {
        incrementNumberOfDealersCards();
        const newCardValue = createRandomCard();
        if (newCardValue == 11) {
            incrementDealersAceCount();
        }
        addValueToDealersHand(newCardValue);
        console.log("Dealer card value generated:", newCardValue);

        return newCardValue

    } catch (error) {
        console.error("Error updating dealer card:", error);
    }
}


async function addPlayerCard() {
    try {
        incrementNumberOfPlayersCards();
        const newCardValue = createRandomCard();
        if (newCardValue == 11) {
            incrementPlayersAceCount();
        }
        addValueToPlayersHand(newCardValue);
        return newCardValue
    } catch (error) {
        console.error("Error in givePlayerCard:", error);
    }
}

// Route to serve a random card for the player
router.get("/playerCard", async (req, res) => {
    try {
        const cardValue = await addPlayerCard(); // Call the function and get the value
        res.json(getCardPic(cardValue)); // Respond with the value directly
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while getting a player card." });
    }
});

// Route to serve a random card for the dealer
router.get("/dealerCard", async (req, res) => {
    try {
        const cardValue = await addDealerCard();
        console.log(cardValue)
        res.json(getCardPic(cardValue));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while getting a dealer card." });
    }
});


// Route to get current hands for a specific user
router.get("/currentPlayerStats", async (req, res) => {
    try {
        // const username = req.params.username.toLowerCase(); // Get the username from the route params
        const username = "pfen"

        // Find the user in the database
        const user = await User.findOne({ user_name: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract the necessary fields from the user object
        const currentPlayerStats = {
            currentPlayerHand: user.currentPlayerHand,
            numberOfCardsInPlayersHand: user.numberOfCardsInPlayersHand,
        };

        res.json(currentPlayerStats); // Respond with the current hands
    } catch (err) {
        console.error("Error retrieving currentPlayerHand stats:", err);
        res.status(500).json({ error: "An error occurred while retrieving currentPlayerHand stats" });
    }
});

router.get("/currentDealerStats", async (req, res) => {
    try {
        // const username = req.params.username.toLowerCase(); // Get the username from the route params
        const username = "pfen"

        // Find the user in the database
        const user = await User.findOne({ user_name: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract the necessary fields from the user object
        const currentDealerStats = {
            currentDealerHand: user.currentDealerHand,
            numberOfCardsInDealersHand: user.numberOfCardsInDealersHand,
        };

        res.json(currentDealerStats); // Respond with the current hands
    } catch (err) {
        console.error("Error retrieving currentDealerStats:", err);
        res.status(500).json({ error: "An error occurred while retrieving currentDealerStats" });
    }
});

// Route to reset hand-related fields in the database
router.post("/resetHands", async (req, res) => {
    try {
        // const { username } = req.body; // Expecting `username` in the request body
        username = "pfen"

        // Ensure the username is provided
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }

        // Find the user by username and reset the relevant fields
        const user = await User.findOneAndUpdate(
            { user_name: username },
            {
                $set: {
                    currentPlayerHand: 0,
                    currentDealerHand: 0,
                    dealerAceCount: 0,
                    playerAceCount: 0,
                    numberOfCardsInPlayersHand: 0,
                    numberOfCardsInDealersHand: 0,
                },
            },
            { new: true } // Return the updated user
        );

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Respond with the updated user data
        res.json({ message: "Hands have been reset.", user });
    } catch (err) {
        console.error("Error resetting hands:", err);
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
