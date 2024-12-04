const express = require("express"); //enable express which allows routing
const mongoose = require("mongoose"); //enable mongodb
const User = require("./models/User");

const PORT_NUMBER = 8080;

// Create an Express application
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost/User")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("images")); // images is now the route folder
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/bootstrap", express.static("node_modules/bootstrap/dist")); //make bootstrap accessible so that express can serve it


// Dummy route for testing
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port ${PORT_NUMBER}`);
});

// Test database logic (optional)
async function run() {
    try {
        const user = new User({ // creates the user
            user_name: "pfen",
            win_percentage: 0,
            wins: 0,
            losses: 0,
        });
        console.log(user);
    } catch (e) {
        console.error(e.message);
    }
}

// Add this route in app.js
app.get("/api/user/:username", async (req, res) => {
    try {
        const username = req.params.username.toLowerCase();
        const user = await User.findOne({ user_name: username }); // find the username in the database

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const winPercentage = user.calculatedWinPercentage; // Use the virtual property
        res.json({ winPercentage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});
