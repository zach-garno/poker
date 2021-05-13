const { debug } = require('console');
const express = require('express');
const axios = require("axios");
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 8080;

const staticPath = path.join(__dirname, './build/')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(staticPath));

app.get('/test', (req, res) => {
  return res.send(`App listening...`);
});

app.post('/upload',function(req, res) {
     try{
       console.log(req.body);
       let payload = req.body;
       if(!fs.existsSync(payload.file)){
         fs.appendFileSync(payload.file, "Participant ID\tGame #\tHand Start Time\tPlayer Action\tUsed AI\vSuggestion\tGame Result\tHand End Time\tAI Recommendation\tCurated Win/Loss\n");
       }
       fs.appendFileSync(payload.file, payload.data + "\n");
     }
     catch(error){
       return res.status(500).send(error);
     }
    return res.status(200).send(req.file)
});

app.use((err, req, res, next) => {
  console.error(err);
  const text = `
    ${Date.now().toString}: Request from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown client'} encountered an error. Details:\n\t${err}
  `;
  fs.writeFile('./temp.txt', text, (err, data) => {
    if (err) console.log('writeFile error: ', err);
});
  return res.status(500).send(err);
});

app.listen(PORT, console.log(`Listening on internal port ${PORT}. Static directory: ${staticPath}`));