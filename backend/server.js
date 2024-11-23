const express = require('express');
const cors = require("cors");
const app = express();
const { exec } = require('child_process');
const axios = require('axios');

app.use(cors());

function addDocumentToSolr(document){
  const solrUrl = 'http://localhost:8983/solr/babysitter_core/update?commit=true';
  axios.post(solrUrl, document, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
        console.log('Risultato dell\'aggiunta del documento:', response.data);
    })
    .catch(error => {
        console.error('Errore nell\'aggiunta del documento:', error);
    });
}

// Funzione asincrona per eseguire una query a Solr
async function queryToSolr(query){
  const solrUrl = 'http://localhost:8983/solr/babysitter_core/select';
  const params = new URLSearchParams({
      q: query,        // Query per Solr
      rows: 10,        // Numero di risultati da restituire
      wt: 'json'       // Formato JSON per la risposta
  });

  try {
    const response = await axios.get(solrUrl, { params });
    return response.data;  // Restituisce i dati dalla risposta Solr
  } catch (error) {
    console.error('Errore nella richiesta Solr:', error);
    return null;  // In caso di errore, restituisce null
  }
}

let babysitters = require("./data_retrieved.json");

app.get("/api/results", async (req, res) => {
  // Aggiungi i dati a Solr solo una volta (potresti voler farlo separatamente, non in ogni richiesta)
  // addDocumentToSolr(babysitters);

  // Costruisci la query per Solr
  const query = "name:"+req.query.query;
  const solrResults = await queryToSolr(query);

  // Se la ricerca su Solr ha successo, restituisci i risultati
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
