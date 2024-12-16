const express = require("express")
const router = express.Router(); // Use router to create modular routes

const aceQns = "1 or 11?";
let currentPlayerHand = 0;
let currentDealerHand = 0;

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

// Helper function to get a random card
function getPlayerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]; //chance of an ace removed (for simplicity) but will be added back later
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    totalHandValue = currentPlayerHand + addedCard;
    currentPlayerHand = totalHandValue;
    if (totalHandValue <= 21) {
        return totalHandValue;
    } else {
        currentPlayerHand = 0;
        return "BUST"
    }
}

function getDealerCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]; //chance of an ace removed (for simplicity) but will be added back later
    const index = Math.floor(Math.random() * possibleHand.length);
    let addedCard = possibleHand[index];
    totalHandValue = currentDealerHand + addedCard;
    currentDealerHand = totalHandValue;
    if (totalHandValue <= 21) {
        return totalHandValue;
    } else {
        currentDealerHand = 0;
        return "BUST"
    }
}



// API endpoint to serve a random card to index.js
router.get("/playerCard", (req, res) => {
    try {
        const card = getPlayerCard(); // Call the getCard function
        res.json({ card }); // Send the card as a JSON response
    } catch (err) {
        console.error(err); // Log any errors
        res.status(500).json({ error: "An error occurred while getting a player card." });
    }
});

// API endpoint to serve a random card to index.js
router.get("/dealerCard", (req, res) => {
    try {
        const card = getDealerCard(); // Call the getCard function
        res.json({ card }); // Send the card as a JSON response
    } catch (err) {
        console.error(err); // Log any errors
        res.status(500).json({ error: "An error occurred while getting a Dealer card." });
    }
});

router.get("/currentHands", (req, res) => {
    res.json({
        playerCurrentHand: currentPlayerHand,
        dealerCurrentHand: currentDealerHand,
    });
});


module.exports = router; // Export the router for use in app.js


// function calculateScore(hand) {
//     let score = 0;
//     let hasAce = false;

//     hand.forEach(card => {
//         if (card === "ace") {
//             hasAce = true;
//             score += 11; // Assume ace is 11 initially
//         } else {
//             score += card;
//         }
//     });

//     // Adjust score if there is an ace and the score exceeds 21
//     if (hasAce && score > 21) {
//         score -= 10; // Make ace count as 1 instead of 11
//     }

//     return score;
// }

function checkWinner(playerScore, dealerScore) {
    if (playerScore > 21) return "Dealer Wins!";
    if (dealerScore > 21) return "Player Wins!";
    if (playerScore === dealerScore) return "Tie!";
    return playerScore > dealerScore ? "Player Wins!" : "Dealer Wins!";
}

module.exports = { router, getDealerCard: getPlayerCard, checkWinner };
