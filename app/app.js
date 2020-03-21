const db = require('./queries');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// app/server... in our case it's the same thing
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// ovverride static index.html preference
app.get('/', (req, res) => {
	res.send("this is home");
})

app.get('/favicon.ico', (req, res) => {
	res.sendFile(path.resolve(__dirname) + '/favicon.ico');
});

// tells express to serve static files from the directory named "public"
app.use(express.static('public'));

app.get('/getBettenanzahl/:hospitalName', db.getHospitalBedsByName);
app.get('/getFreieBetten/:hospitalName', db.getFreeHospitalBedsByName);

app.put('/setBettenanzahl/:hospitalName', db.setHospitalBedsByName);
app.put('/setFreieBetten/:hospitalName', db.setFreeHospitalBedsByName);

app.put('/incrementBettenanzahl/:hospitalName', db.incrementHospitalBedsByName);
app.put('/incrementFreieBetten/:hospitalName', db.incrementFreeHospitalBedsByName);


// 404 response for all unspecified routes
app.all('*', (request, response) => {
	// console.log(request)
	response.status(404);
	response.send("Wait, that's illegal!");
});

// start the app
app.listen(port, () => {
	console.log('starting the boi up');
});