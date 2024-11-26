const express = require('express');
const cors = require("cors");
const app = express();
const { exec } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');
const fs = require('fs');
app.use(cors());
app.use(express.json());

const SOLR_BASE_URL = 'http://localhost:8983/solr/babysitter_core';
const babysitters = require("./data_retrieved.json");

const execAsync = promisify(exec);

async function esegui(command) {
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stderr) console.error(`Errore comando: ${stderr}`);
        console.log(`Risultato comando: ${stdout}`);
    } catch (error) {
        console.error(`Errore nell'esecuzione del comando: ${error.message}`);
    }
}

async function deleteDocumentsByQuery() {
    try {
        const deleteXml = fs.readFileSync('./deleteAll.xml', 'utf-8');
        const solrUrl = `${SOLR_BASE_URL}/update?commit=true`;
        const response = await axios.post(solrUrl, deleteXml, {
            headers: { 'Content-Type': 'text/xml' },
        });
        console.log("Documenti eliminati con successo:", response.data);
    } catch (error) {
        console.error("Errore nell'eliminazione dei documenti:", error);
    }
}

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

async function queryToSolr(query, start) {
    try {
        const solrUrl = `${SOLR_BASE_URL}/select`;
        const params = new URLSearchParams({
            q: query,
            wt: 'json',
            rows: 10,
            start: ((start-1)*10),
        });
        const response = await axios.get(solrUrl, { params });
        return response;
    } catch (error) {
        console.error("Errore nella richiesta Solr:", error);
        return null;
    }
}

async function main() {
    try {
        await esegui('solr-9.7.0/bin/solr stop --all');
        await esegui('solr-9.7.0/bin/solr start');
        //await esegui('solr-9.7.0/bin/solr create -c babysitter_core');
        //await esegui('python3 ./retrieve.py');
        //await deleteDocumentsByQuery();
        //await addDocumentToSolr(babysitters);
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server in esecuzione su http://localhost:${PORT}`);
        });
        console.log("Inizializzazione completata con successo!");
    } catch (error) {
        console.error("Errore nel flusso principale:", error);
    }
}

main();

app.get("/api/results", async (req, res) => {
    let query = "(name:" + req.query.query + "* OR description:*" + req.query.query + "*)";
    //else query = "(name:" + req.query.query + "* or description:*" + req.query.query + "*) and (age or salary)";

    const ageRange = req.query.ageRange ? JSON.parse(req.query.ageRange) : [15, 70];
    const salaryRange = req.query.salaryRange ? JSON.parse(req.query.salaryRange) : [10, 40];

    const filters = [
        `age:[${ageRange[0]} TO ${ageRange[1]}]`, 
        `salary:[${salaryRange[0]} TO ${salaryRange[1]}]`
    ];

    if(ageRange[0]>15||ageRange[1]<70){
        query+= " AND ("+filters[0]+")";
    }
    if(salaryRange[0]>10||salaryRange[1]<40){
        query+=" AND ("+filters[1]+")";
    } 
    const solrResults = await queryToSolr(query,req.query.page);

    const numfound=solrResults.data.response.numFound;
    const ress=solrResults.data;
    ress.response.docs.forEach(e => {
        var toAssign = e.description[0].replace(new RegExp(req.query.query, 'gi'), "<b>$&</b>");
        e.description[0] = toAssign;  
    });

    const solrUrl = `${SOLR_BASE_URL}/select`;
    const params = new URLSearchParams({
        q: query,
        wt: 'json',
        rows: 3,
    });
    
    const response = await axios.get(solrUrl, { params });
    const sugg=response.data.response.docs;
    sugg.forEach(e => {
        var toAssign = e.description[0].replace(new RegExp(req.query.query, 'gi'), "<b>$&</b>");
        e.description[0] = toAssign;  
    });

    if (solrResults) {
        res.json([ress.response.docs,sugg,numfound]);
    } else {
        res.status(500).json({ error: 'Errore nella ricerca Solr' });
    }
});


