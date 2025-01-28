const { triggerAsyncId } = require("async_hooks");
const mongoose = require("mongoose");


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
        min: 0,
        default: 0
    },
    losses: {
        type: Number,
        Required: true,
        min: 0,
        default: 0
    },
    currentPlayerHand: {
        type: Number,
        min: 0,
        default: 0
    },
    currentDealerHand: {
        type: Number,
        min: 0,
        default: 0
    },
    numberOfCardsInPlayersHand: {
        type: Number,
        min: 0,
        default: 0
    },
    numberOfCardsInDealersHand: {
        type: Number,
        min: 0,
        default: 0
    },
    dealerAceCount: {
        type: Number,
        min: 0,
        default: 0
    },
    playerAceCount: {
        type: Number,
        min: 0,
        default: 0
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
    },
    cheatSheetToggle: {
        type: Boolean,
        default: true
    }

})

// A virtual property does not store the win_percentage in the database but calculates it on demand
userSchema.virtual('calculatedWinPercentage').get(function () {
    const totalGames = this.wins + this.losses;
    return totalGames > 0 ? (this.wins / totalGames) * 100 : 0;
});


const User = mongoose.model('Users', userSchema)

module.exports = User

