const express = require("express");
const router = express.Router(); // Use router to create modular routes
const User = require("./models/User");


async function addWin() {
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

async function addLoss() {
    try {
        // const { username } = req.params;
        username = "pfen"
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { $inc: { losses: 1 } },
            { new: true }
        );
        if (!user) {
            console.error("user not found")
        }
        console.log("loss updated successfully")
    } catch (err) {
        console.error("Error updating loss:", err);
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

async function setDealersAceCount(newValue) {
    try {
        // const { username } = req.params;
        const username = "pfen"; // Replace with dynamic username if needed
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { dealerAceCount: newValue }, // Set currentPlayerHand to the new value
            { new: true }
        );
        if (!user) {
            console.error("User not found");
            return;
        }
    } catch (err) {
        console.error("Error attempting to reset value of dealers's acecount", err);
    }
}

async function setPlayersAceCount(newValue) {
    try {
        // const { username } = req.params;
        const username = "pfen"; // Replace with dynamic username if needed
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { playerAceCount: newValue }, // Set currentPlayerHand to the new value
            { new: true }
        );
        if (!user) {
            console.error("User not found");
            return;
        }
    } catch (err) {
        console.error("Error attempting to reset value of player's acecount", err);
    }
}

async function getPlayersAceCount() {
    // const username = req.params.username.toLowerCase(); // Get the username from the route params
    const username = "pfen"

    // Find the user in the database
    const user = await User.findOne({ user_name: username });

    // return playerAceCount from db
    return user.playerAceCount
}

async function getDealersAceCount() {
    // const username = req.params.username.toLowerCase(); // Get the username from the route params
    const username = "pfen"

    // Find the user in the database
    const user = await User.findOne({ user_name: username });

    // return dealerAceCount from db
    return user.dealerAceCount
}

async function adjustAcesForPlayer() {
    let aceCount = await getPlayersAceCount();

    // retrieve current dealerhand from db
    let playerCurrentHand = await getCurrentPlayerHand();

    // account for aces if the hand is now above 17
    if (playerCurrentHand > 21 && aceCount > 0) {
        while (playerCurrentHand > 21 && aceCount > 0) { 
            playerCurrentHand -= 10; // Reduce playerCurrentHand from 11 to 1
            aceCount--; 
        }
        await SetValueOfPlayersHand(playerCurrentHand);
        await setPlayersAceCount(aceCount);
    } 
}

async function adjustAcesForDealer() {
    let aceCount = await getDealersAceCount();

    // retrieve current dealerhand from db
    let dealerCurrentHand = await getCurrentDealerHand();

    // account for aces if the hand is now above 17
    if (dealerCurrentHand > 21 && aceCount > 0) {
        while (dealerCurrentHand > 21 && aceCount > 0) { 
            dealerCurrentHand -= 10; // Reduce dealerCurrentHand from 11 to 1
            aceCount--; 
        }
        await SetValueOfDealersHand(dealerCurrentHand);
        await setDealersAceCount(aceCount);
    } 
}

async function getCurrentDealerHand(){
    // const username = req.params.username.toLowerCase(); // Get the username from the route params
    const username = "pfen"

    // Find the user in the database
    const user = await User.findOne({ user_name: username });

    // return current dealerhand from db
    return user.currentDealerHand
}

async function getCurrentPlayerHand(){
    // const username = req.params.username.toLowerCase(); // Get the username from the route params
    const username = "pfen"

    // Find the user in the database
    const user = await User.findOne({ user_name: username });

    // return current playerhand from db
    return user.currentPlayerHand
}

async function getNumberOfCardsInPlayersHand() {
    // const username = req.params.username.toLowerCase(); // Get the username from the route params
    const username = "pfen"

    // Find the user in the database
    const user = await User.findOne({ user_name: username });

    // return current playerhand from db
    return user.numberOfCardsInPlayersHand
}

async function CheckPlayersHand() {
    playerCurrentHand = await getCurrentPlayerHand();
    console.log("player current hand:" + playerCurrentHand)
    const numberOfCardsInPlayersHand = await getNumberOfCardsInPlayersHand();

    if (playerCurrentHand > 21) {
        addLoss();
        return "loss"
    } 

    if (numberOfCardsInPlayersHand == 5) {
        addWin(); // if after 5 hits the hand is less than 21 insta win (5-Card Charlie rule)
        return "Charlie-win"
    } 

    return "continue"
}

async function CheckDealersHand() {
    dealerCurrentHand = await getCurrentDealerHand();
    playerCurrentHand = await getCurrentPlayerHand();

    if (dealerCurrentHand >= 17) { //check 
        if (dealerCurrentHand <= 21 && dealerCurrentHand > playerCurrentHand) {
            await addLoss(); //player loses
            return "loss"
        } else if (dealerCurrentHand == playerCurrentHand) {
            return "draw"
        } else {
            await addWin();
            return "win"
        }
    } else {
        return "continue"
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

async function SetValueOfDealersHand(newValue) {
    try {
        // const { username } = req.params;
        const username = "pfen"; // Replace with dynamic username if needed
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { currentDealerHand: newValue }, // Set currentDealerHand to the new value
            { new: true }
        );
        if (!user) {
            console.error("User not found");
            return;
        }
        console.log("Set value of dealer's hand successfully:", user.currentDealerHand);
    } catch (err) {
        console.error("Error attempting to set value of dealer's hand", err);
    }
}

async function SetValueOfPlayersHand(newValue) {
    try {
        // const { username } = req.params;
        const username = "pfen"; // Replace with dynamic username if needed
        const user = await User.findOneAndUpdate(
            { user_name: username },
            { currentPlayerHand: newValue }, // Set currentPlayerHand to the new value
            { new: true }
        );
        if (!user) {
            console.error("User not found");
            return;
        }
        console.log("Set value of player's hand successfully:", user.currentPlayerHand);
    } catch (err) {
        console.error("Error attempting to set value of player's hand", err);
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
        await incrementNumberOfDealersCards();
        const newCardValue = await createRandomCard();
        if (newCardValue == 11) {
            await incrementDealersAceCount();
        }
        await addValueToDealersHand(newCardValue);
        console.log("Dealer card value generated:", newCardValue);

        return newCardValue

    } catch (error) {
        console.error("Error updating dealer card:", error);
    }
}


async function addPlayerCard() {
    try {
        await incrementNumberOfPlayersCards();
        const newCardValue = await createRandomCard();
        if (newCardValue == 11) {
            await incrementPlayersAceCount();
        }
        await addValueToPlayersHand(newCardValue);
        return newCardValue
    } catch (error) {
        console.error("Error in givePlayerCard:", error);
    }
}

// Route to serve a random card for the player
router.get("/playerCard", async (req, res) => {
    try {
        const newCardValue = await addPlayerCard()
        await adjustAcesForPlayer();
        const additionalPlayerCardOutcome = await CheckPlayersHand(); // Call the function and get the value
        console.log(additionalPlayerCardOutcome);

        console.log(newCardValue)
        if (additionalPlayerCardOutcome == "win") {
            res.json({
                outcome: "win",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalPlayerCardOutcome == "loss") {
            res.json({
                outcome: "loss",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalPlayerCardOutcome == "draw") {
            res.json({
                outcome: "draw",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalPlayerCardOutcome == "continue") { // if adding dealer card hasn't ended game return newCardPic
            res.json({
                outcome: "continue",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalPlayerCardOutcome == "Charlie-win") {
            res.json({
                outcome: "Charlie-win",
                cardPic: getCardPic(newCardValue)
            });
        } else {
            res.status(500).json({ error: "An error occurred while finding outcome in gameplay.js" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while getting a player card." });
    }
});

// Route to serve a random card for the dealer
router.get("/dealerCard", async (req, res) => {
    try {
        const newCardValue = await addDealerCard()
        await adjustAcesForDealer();
        const additionalDealerCardOutcome = await CheckDealersHand();

        
        if (additionalDealerCardOutcome == "win") {
            res.json({
                outcome: "win",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalDealerCardOutcome == "loss") {
            res.json({
                outcome: "loss",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalDealerCardOutcome == "draw") {
            res.json({
                outcome: "draw",
                cardPic: getCardPic(newCardValue)
            });
        } else if (additionalDealerCardOutcome == "continue") { // if adding dealer card hasn't ended game return newCardPic
            res.json({
                outcome: "continue",
                cardPic: getCardPic(newCardValue)
            });
        } else {
            res.status(500).json({ error: "An error occurred while finding outcome in gameplay.js" });
        }

        
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


module.exports = { router };
