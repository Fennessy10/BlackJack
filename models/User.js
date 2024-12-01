const { triggerAsyncId } = require("async_hooks");
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
        Unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 10
    },
    wins: {
        type: Number,
        Required: true,
        min: 0
    },
    losses: {
        type: Number,
        Required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        immutable: true, //ensures this acts as created at rather than updated at
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    friend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }

})

// A virtual property does not store the win_percentage in the database but calculates it on demand
userSchema.virtual('calculatedWinPercentage').get(function () {
    const totalGames = this.wins + this.losses;
    return totalGames > 0 ? (this.wins / totalGames) * 100 : 0;
});


const User = mongoose.model('Users', userSchema)

module.exports = User

