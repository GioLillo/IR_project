const express = require('express');
const fs = require('fs');
const app = express();

// Endpoint to serve the data
app.get('/api/results', (req, res) => {
    fs.readFile('data_retrieved.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load data' });
        } else {
            const parsedData = JSON.parse(data);
            res.json(parsedData[0]); // Assuming your data is a nested array
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
