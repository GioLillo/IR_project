const express = require('express');
const cors = require("cors");
const app = express();
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs'); 
app.use(cors());
app.use(express.json()); 
function esegui(command){
  exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Execution error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Python script error: ${stderr}`);
        return;
    }
    console.log('Data retrieved successfully:', stdout);
  });
}
esegui('solr-9.7.0/bin/solr stop')
esegui('solr-9.7.0/bin/solr start')
esegui('python3 ./retrieve.py')
const SOLR_BASE_URL = 'http://localhost:8983/solr/babysitter_core';
async function deleteDocumentsByQuery() {
    try {
        const deleteXml = fs.readFileSync('./deleteAll.xml', 'utf-8'); // Legge il file deleteAll.xml
        const solrUrl = `${SOLR_BASE_URL}/update?commit=true`;
        
        const response = await axios.post(solrUrl, deleteXml, {
            headers: { 'Content-Type': 'text/xml' },
        });
        console.log("Documenti eliminati con successo:", response.data);
    } catch (error) {
        console.error("Errore nell'eliminazione dei documenti:", error);
    }
}


// Funzione per aggiungere documenti a Solr
async function addDocumentToSolr(document) {
    try {
        const solrUrl = `${SOLR_BASE_URL}/update?commit=true`;
        const response = await axios.post(solrUrl, document, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log("Risultato dell'aggiunta del documento:", response.data);
    } catch (error) {
        console.error("Errore nell'aggiunta del documento:", error);
    }
}

// Funzione per eseguire una query su Solr
async function queryToSolr(query) {
    try {
        const solrUrl = `${SOLR_BASE_URL}/select`;
        const params = new URLSearchParams({
            q: query,
            wt: 'json', // Formato JSON
            hl: 'true',      // Abilita highlighting
            'hl.fl': 'name,description', // Campi da evidenziare
            'hl.simple.pre': '<em>',    // Tag di inizio evidenziazione
            'hl.simple.post': '</em>',  // Tag di fine evidenziazione
        });

        const response = await axios.get(solrUrl, { params });
        return response.data;
    } catch (error) {
        console.error("Errore nella richiesta Solr:", error);
        return null;
    }
}


let babysitters = require("./data_retrieved.json");
deleteDocumentsByQuery()
addDocumentToSolr(babysitters);
app.get("/api/results", async (req, res) => {
  
  const query = "name:"+req.query.query+"* or description:*"+req.query.query+"*";
  const solrResults = await queryToSolr(query);

  if (solrResults) {
    res.json(solrResults.response.docs);
  } else {
    res.status(500).json({ error: 'Errore nella ricerca Solr' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
