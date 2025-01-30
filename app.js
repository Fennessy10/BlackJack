const express = require("express"); //enable express which allows routing
const mongoose = require("mongoose"); //enable mongodb
const User = require("./models/User");
const { router: gameplayRoutes } = require("./gameplay");
const { router: cheatsRoutes } = require("./cheats"); // Import cheats routes


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
// Serve static files from the public folder too
app.use(express.static("public"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/bootstrap", express.static("node_modules/bootstrap/dist")); //make bootstrap accessible so that express can serve it


// Dummy route for testing
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/sign-in", (req, res) => {
    res.render("sign-in");
})

app.get("/sign-up", (req, res) => {
    res.render("sign-up");
})

app.get("*", (req, res) => {
    res.render("404")
})

// Start the server
app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port ${PORT_NUMBER}`);
});


// temporary tool to add a new user
async function run() {
    try {
        const user = new User({ // creates the user
            user_name: "pfen",
        });

        // Save the user to the database

        // console.log(user);
        // await user.save();
    } catch (e) {
        console.error(e.message);
    }
}



// the api is called by the front-end, namely User.js thus this acts to serve the front-end
app.get("/api/:username/winPercentage", async (req, res) => {
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

app.get("/api/:username/gamesPlayed", async (req, res) => {
    try {
        const username = req.params.username.toLowerCase();
        const user = await User.findOne({ user_name: username }); // find the username in the database

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const gamesPlayed = user.numberOfGamesPlayed; // Use the virtual property
        res.json({ gamesPlayed });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
    }
});


// Mount gameplay-related routes
app.use("/api/:username", gameplayRoutes); // All gameplay routes now include the username
app.use("/api/:username", cheatsRoutes); // All gameplay routes now include the username
run();