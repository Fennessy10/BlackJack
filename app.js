const express = require("express"); //enable express which allows routing
const mongoose = require("mongoose"); //enable mongodb
const router = express.Router(); //allows for routing
const User = require("./models/User");

mongoose.connect("mongodb://localhost/User")


async function run() {
    const user = new User({
        user_name: "pfen",
        win_percentage: 0,
        wins: 0,
        lossed: 0

    })
    await user.save();
    console.log(user);
}

