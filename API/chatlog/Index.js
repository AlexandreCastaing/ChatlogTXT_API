console.clear();
console.log("==-==-==-==-==-==-==-==");
console.log(`${process.env.APP_NAME} . Vers: ${process.env.VERS}`)
console.log(`Ready on ${process.env.NODE_ENV} mode`)
console.log("");
console.log("==-==-==-==-==-==-==-==");

// libs
const express = require('express'); 
const app = express();
let bodyParser = require('body-parser');
let cors = require('cors');

let ChatlogServiceClass = require("./chatlogService.js");
let RoutesClass = require("./routes.js");

// chatlog services
const chatlogService = new ChatlogServiceClass();

app.use(cors());

// Routes on Routes.js file
new RoutesClass(app, chatlogService, bodyParser);

let port = process.env.PORT;
// Start express
app.listen(port, () => {
    console.log(`API ON: ${process.env.API_URL}:${process.env.PORT}`)
})