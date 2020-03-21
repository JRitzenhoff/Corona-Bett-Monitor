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


app.get('/test', db.getHospitals);
app.get('/getBettenanzahl/:hospitalName', db.getTotalHospitalBeds)
app.get('/getFreieBetten/:hospitalName', db.getFreeHospitalBeds)

// app.put('/ib/:hospitalName', db.incrementUsedBeds)

app.put('/setBettenanzahl/:hospitalName', db.setTotalBeds)
app.put('/setFreieBetten/:hospitalName', db.setFreeBeds)

// 404 response for all unspecified routes
app.all('*', (request, response) => {
	console.log(request)
	response.status(404);
	response.send("Wait, that's illegal!");
});

// start the app
app.listen(port, () => {
	console.log('starting the boi up');
});