const express = require("express");
const router = express.Router(); // Use router to create modular routes
const User = require("./models/User");

router.post("/toggleCheats", async (req, res) => {
    try {
        // Simulate getting the username from the request
        const username = "pfen";

        // Find the user and toggle the cheatSheetToggle value
        const user = await User.findOneAndUpdate(
            { user_name: username },
            [
                // Use MongoDB aggregation pipeline to toggle the value
                { $set: { cheatSheetToggle: { $not: "$cheatSheetToggle" } } }
            ],
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({ message: "Cheats updated successfully.", user });
    } catch (err) {
        console.error("Error updating cheat preference:", err);
        res.status(500).json({ error: "An error occurred while updating cheat preference." });
    }
});

router.get("/toggleCheats", async (req, res) => {
    try {
        const username = "pfen"; // Replace with dynamic username if needed (e.g., from req.params or req.query)

        // Find the user by their username
        const user = await User.findOne({ user_name: username });

        // Handle the case where the user is not found
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Send the cheatSheetToggle value
        res.json({ cheatSheetToggle: user.cheatSheetToggle });
    } catch (err) {
        console.error("Error fetching cheat preference:", err);
        res.status(500).json({ error: "An error occurred while fetching cheat preference." });
    }
});

module.exports = { router };