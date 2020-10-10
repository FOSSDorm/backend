const express = require('express')
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('FOSSDorm')
});

app.listen(port, () => {
  console.log(`${port}!`)
});