const mongoose = require("mongoose");

// const aceQns = "1 or 11?"

// function getRandom(max) {
//     return Math.floor(Math.random() * max);
// }

// function getCard() {
//     const dealersHand = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "ace"] ;
//     let index = getRandom(dealersHand.length);
//     let card =  dealersHand[index];

//     if (card === "ace") {
//         document.getElementById("hit").disabled = true;
//         document.getElementById("stand").disabled = true;
//     } else {
//         document.getElementById("hit").disabled = false;
//         document.getElementById("stand").disabled = false;
//     }
// }


// specifies the structure of the database
const userSchema = new mongoose.Schema({
    user_name:{
        type: String,
        Required: true,
        Unique: true
    },
    win_percentage: {
        type: Number,
    },
    wins: {
        type: Number,
    },
    losses: {
        type: Number,
    }

})

const User = mongoose.model('Users', userSchema)

module.exports = User

