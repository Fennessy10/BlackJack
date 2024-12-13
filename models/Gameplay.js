// gameplay.js

const aceQns = "1 or 11?";

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function getCard() {
    const possibleHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "ace"];
    const index = getRandom(possibleHand.length);
    return possibleHand[index];
}

function calculateScore(hand) {
    let score = 0;
    let hasAce = false;

    hand.forEach(card => {
        if (card === "ace") {
            hasAce = true;
            score += 11; // Assume ace is 11 initially
        } else {
            score += card;
        }
    });

    // Adjust score if there is an ace and the score exceeds 21
    if (hasAce && score > 21) {
        score -= 10; // Make ace count as 1 instead of 11
    }

    return score;
}

function checkWinner(playerScore, dealerScore) {
    if (playerScore > 21) return "Dealer Wins!";
    if (dealerScore > 21) return "Player Wins!";
    if (playerScore === dealerScore) return "Tie!";
    return playerScore > dealerScore ? "Player Wins!" : "Dealer Wins!";
}

export { getCard, calculateScore, checkWinner };
