// const express = require("express");
// const router = express.Router(); // Use router to create modular routes



document.addEventListener("DOMContentLoaded", async () => {

    const playBtn = document.getElementById("Play")
    const loading = document.getElementById("loading")

    playBtn.addEventListener("click", async () => {
        console.log("Play button clicked!");

        playBtn.style.display = "none";
        loading.style.display = "block";
        

        const response = await fetch("/api/username")
        if (!response.ok) throw new Error("Failed to fetch player username");

        const data = await response.json();
        console.log("username from sign-in.js: " + data.username)

        window.location.href = "/game/" + encodeURIComponent(data.username); // Example: redirect to another page
    });

});
