const express = require("express"); //enable express which allows routing
const mongoose = require("mongoose"); //enable mongodb
const User = require("./models/User");
const { router: gameplayRoutes } = require("./gameplay");
const { router: cheatsRoutes } = require("./cheats"); // Import cheats routes
const dotenv = require("dotenv");
dotenv.config();


const PORT_NUMBER = process.env.PORT || 8080;

// Create an Express application
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECT_URI)
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
app.get("/game/:username", (req, res) => {
    res.render("index");
});

app.get("/", (req, res) => {
    res.render("sign-in");
})

// Start the server
app.listen(PORT_NUMBER, () => {
    console.log(`Listening on port ${PORT_NUMBER}`);
});


// temporary tool to add a new user
async function run() {
    try {
        const user = new User({ // creates the user
            user_name: "lfen",
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

// temporary tool to add a new user
async function run(username) {
    try {
        const user = new User({ // creates the user
            user_name: username,
        });

        // Save the user to the database
        console.log(user);
        await user.save();


    } catch (e) {
        console.error(e.message);
    }
}

function createID() {
    return Date.now().toString()
}



app.get("/api/username", async (req, res) => {
    try {
        const username = createID()
        await run(username)

        console.log("username from app.js: " + username)
        // Respond with the updated user data
        res.json({username});
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: "An error occurred while adding user" });
    }
});



// Mount gameplay-related routes
app.use("/api", gameplayRoutes); // All gameplay routes now include the username
app.use("/api", cheatsRoutes); // All gameplay routes now include the username
