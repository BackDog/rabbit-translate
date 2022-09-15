const express = require('express');
const { chromium } = require("playwright-chromium");

const app = express();

console.log('Starting Server....');

app.get('/translate', function (req, res) {
    console.log('Translate ' + req.query.text);
    res.send(req.query.text);
})

app.listen(3000);