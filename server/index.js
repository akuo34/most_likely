const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3500;

app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});