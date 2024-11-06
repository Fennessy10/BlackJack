const aceQns = "1 or 11?"

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function getCard() {
    const dealersHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "ace"] ;


    let index = getRandom(dealersHand.length);

    let card =  dealersHand[index];

    if (card == "ace") {
        
    }
}


