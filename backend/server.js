const express = require('express');
const fs = require('fs');
const app = express();
const { exec } = require('child_process');
exec('python3 ./retrieve.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Data retrieved`);
  });

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
