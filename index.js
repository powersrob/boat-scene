const express = require('express')
const path = require("path");
const app = express();
global.__basedir = __dirname;

app.use(express.static(path.join(__dirname, "public")));

var listener = app.listen(3005, function() {
	console.log("http://localhost:" + listener.address().port);
});

