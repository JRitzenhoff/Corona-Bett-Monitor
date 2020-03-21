const express = require('express');
const path = require('path');

// app/server... in our case it's the same thing
const app = express();
const port = process.env.PORT || 3000; // process.env.PORT is actually never used, but for good measure we'll keep it

// tells express to serve static files from the directory named "public"
app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
	res.sendFile(path.resolve(__dirname) + '/favicon.ico');
});

// 404 response for all unspecified routes
app.all('*', (request, response) => {
	response.status(404);
	response.send("Wait, that's illegal!");
});

// start the app
app.listen(port, () => {
	console.log('starting the boi up');
});