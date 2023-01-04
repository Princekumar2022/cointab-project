const express = require('express');
require('dotenv').config()
const route = require('./routes/route');
const body_Parser = require('body-parser')

const app = express();


app.use(body_Parser.json())


app.use(route);

app.listen(3000, function () {
  console.log("Express app running on port " + 3000);
})