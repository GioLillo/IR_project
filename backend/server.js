const express = require('express');
const cors = require("cors");
const app = express();
const { exec } = require('child_process');

app.use(cors());

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

const babysitters = require("./data_retrieved.json");

app.get("/api/data", (req, res) => {
  res.json(babysitters);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
