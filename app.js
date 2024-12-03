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
app.use(express.static("images"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dummy route for testing
app.get("/", (req, res) => {
    res.send("Server is running!");
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
