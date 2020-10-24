console.clear();
console.log("==-==-==-==-==-==-==-==");
console.log(`${process.env.APP_NAME} . Vers: ${process.env.VERS}`)
console.log(`Ready on ${process.env.NODE_ENV} mode`)
console.log("");
console.log("==-==-==-==-==-==-==-==");

// libs
const express = require('express'); 
const app = express();
var bodyParser = require('body-parser');

let ChatlogServiceClass = require("./ChatlogService.js");
let RoutesClass = require("./Routes.js");

// chatlog services
const chatlogService = new ChatlogServiceClass();

// Routes on Routes.js file
new RoutesClass(app, chatlogService, bodyParser);

// Start express
let port = process.env.PORT;
app.listen(port, () => {
    console.log(`API ON: ${process.env.API_URL}:${process.env.PORT}`)
})