const express = require("express"); //enable express which allows routing
const mongoose = require("mongoose"); //enable mongodb
const router = express.Router(); //allows for routing
const User = require("./models/User");

mongoose.connect("mongodb://localhost/User")


async function run() {
    try{
        const user = new User({ // creates the user
            user_name: "pfen",
            win_percentage: 0,
            wins: 0,
            losses: 0
        })
        // await user.save(); // saves the user to the database
        // await User.deleteMany({ user_name: "pfen"});
        console.log(user);
    } catch (e) {
        console.error(e.message);
    }

}


