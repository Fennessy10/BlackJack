async function fetchWinPercentage(username) {
    try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) {
            throw new Error(`Error fetching win percentage: ${response.status}`);
        }

        const data = await response.json();
        const winPercentage = data.winPercentage.toFixed(2); // Format to 2 decimal places

        // Update the HTML with the win percentage
        document.getElementById('win-percentage').innerText = `${winPercentage}%`;
    } catch (error) {
        console.error(error);
        document.getElementById('win-percentage').innerText = 'N/A';
    }
}

// Call the function with the username
fetchWinPercentage("pfen");
