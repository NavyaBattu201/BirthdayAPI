var express = require("express");
var app = express();
var firstcontroller = require('./controllers/allcontroller');


//firing addandupdate
firstcontroller(app);



app.listen(3000);