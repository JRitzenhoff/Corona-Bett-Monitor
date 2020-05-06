/* require NOTES:
https://nodejs.org/en/knowledge/getting-started/what-is-require/

"require" is a nodeJS method for importing modules that are in other files
	- is the same thing as python's "import" and C's "#include"

- string arguments that look like file-paths... 
	Are file-paths (i.e. './queries' points to the file within this directory named queries.js)

- string arguments that are just names...
	Point to modules installed by npm (i.e. 'express' points to ./node_modules/express)
*/

/* npm NOTES:
https://www.npmjs.com/

Node Package Manager (NPM) allows for an easy way to:
	1. install modules from a verified database (code written by other developers) -- npm install {name of package}
		1.1. get an existing project environment on your local computer easily -- npm install
	2. initialize a basic node project (with all necessary folders/files) -- npm init
	3. run the project in different environments -- npm run {name of script}
		3.1. using nodemon to relaunch server everytime that the backend files are saved -- (see package.json "scripts")
		3.2. running tests -- (see package.json "scripts")

	inf. A lot more stuff that I don't yet know about
*/

// file-system package
const fs = require('fs'); 
const path = require('path');

const { JSDOM } = require('jsdom');

/* https://expressjs.com/en/starter/hello-world.html

Wraps the HTTP handling provided by node
	Look at this for understanding of HTTP messages: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
	Look at this to see how annoying it is to handle them by default: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/ 
*/
const express = require('express');
const session = require('express-session');

/* https://github.com/expressjs/body-parser

Acts as a middleware for HTTP parsing in express.
Translations the request.body (multi-line-strings) into requested format 
	in this app's case... JSON: see 'app.use(bodyParser.json())'
*/
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const LocalStrategy3 = require('./passport-local-3').Strategy;
// passport.use(new LocalStrategy3( { parentField: 'krankenhaus' }, db.fillVerifiedUser3 ));
// IN app.get('/login'): passport.authenticate('local', { failureRedirect: '/login' }),


/* require('./queries') NOTES:

Equivalent to python "import queries as db"
Allows this file to reference any methods listed in FILE queries.js FIELD module.exports
*/
const db = require('./queries');



/* middleware NOTES:
https://expressjs.com/en/guide/using-middleware.html

Term apparently coined by express.
Is name for software that you can plop in-between function calls
	- accepts inputs and a next() function
	- edits inputs and passes them to the next() function

NOTE: The middleware is called in the order that it is declared 
	i.e changing the order of two 'use()' calls can potentially break the code
*/

// does nothing to the inputs and prints the time & method & path of an http request to the backend
const loggerMiddleware = (req, resp, next) => {
	const now = new Date();
	const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
	const path = `"${req.method} ${req.path}"`;
	const m = `${req.ip} - ${time} - ${path}`;
	
	// eslint-disable-next-line no-console
	console.log(m);
	next();
};

// initialize the server
const app = express();
const port = 3000;

// initialize the key for a session
// should not have secret key here either
app.use( session({ secret: 'secret session key', resave: true, saveUninitialized: true }) ); 

// initialize the passport module (not sure what exactly this does)
app.use(passport.initialize());
// initialize the session
app.use(passport.session());


/* strategy NOTES:
Translates HTTP messages into "username" and "password" objects and 
	calls a provided function with those arguments

i.e. When passport.authenticate() is called (see POST '/login')...
	the declared strategy is called...
	which calls the method 'db.fillVerifiedUser' ...
	which checks the database for a user and returns one if found (or returns an error)
*/
passport.use(new LocalStrategy( /*{ usernameField: 'email', passwordField: 'password' }, */ db.fillVerifiedUser ));

// Adds a userID to a group of actively logged in users
passport.serializeUser((user, done) => { done(null, user.employeeid); });

// Removes a user (found by id) from a group of actively logged in users
passport.deserializeUser( db.fillUserById );
	


// Only applies transformation where 'Content-Type' matches 'type'... defaults to 'application/json'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Logging for each request
app.use(loggerMiddleware);

/* HTTP request NOTES:
GET - extract data from server
	* think loading a web-page in a browser (front-end needs to get html from backend)

POST - give data to server, expect path or something in return
	* think creating a google-doc... Path will always be generated by the server

PUT - give data to server, same thing happens everytime 
	* think editing database
*/

/* express METHOD NOTES:
These are all wrappers for "use"... aka middleware
	- implementation is essentially:
			if ("GET" == req.method) {
				next()
			}

OUR function implementations do not accept a "next()" input so the function calls stop with us
	- if you hover over the method name in Visual Studio Code, you will see that getHospitalBedsByName is a function
		declared within the db object... AKA require('./queries')... AKA listing in FILE queries.js VARIABLE module.exports

The format of the path contain parameter arguments (prefixed by ':') that are added to the request object by express
	i.e. /getBettenanzahl/:hospitalName... results in a request object with params field hospitalName
		-- const hp = req.params.hospitalName
		-- const { hospitalName } = req.params
*/

// // tells express to serve static files from the directory named "public"
// app.use(express.static('public'));

// HTTP GET handlers
app.get('/getHospitalName', db.getUserHospitalName);
app.get('/getBettenanzahl', db.getUserHospitalBeds);
app.get('/getFreieBetten', db.getUserFreeHospitalBeds);

app.get('/getBettenanzahl/:hospitalName', db.getHospitalBedsByName);
app.get('/getFreieBetten/:hospitalName', db.getFreeHospitalBedsByName);

app.get('/top10FullBeds', db.getTopTenHospitalBedCounts);
app.get('/top10FreeBeds', db.getTopTenHospitalFreeBedCounts);

app.get('/hospitals/:region/:direction/:attribute', db.getSpecificHospital);

app.get('/user/:username', db.httpGetUser);


app.get('/', 
	(req, res) => {
		const directoryPath = path.join(__dirname, "public");

		const defaultResponse = () => { res.sendFile("index.html", { root : directoryPath }); }

		// if there is a not user, just return the default index file
		if (!req.user) {
			// res.sendFile("index.html", { root : directoryPath });
			defaultResponse();
			return;
		}

		// get the file from the directoryPath
		fs.readFile(path.join(directoryPath, "index.html"), 
			'utf8',
			(err, data) => {
				if (err) {
					defaultResponse();
					return;
				}
				
				// create the "document" object that is accessible in browsers
				const { document } = (new JSDOM(data)).window;

				// edit the link with id="loginRef"
				const loginRef = document.getElementById("loginRef");
				loginRef.innerHTML = "Logout"
				loginRef.setAttribute("href", "/logout");

				// actually send the file as the response
				res.send(document.documentElement.outerHTML);
		});
	}
);

app.get('/updateBetten', 
	(req, res) => {
		// if there IS a user... Load the updateBetten html page
		if (req.user) {
			// res.redirect('/updateBetten.html');
			res.sendFile('updateBetten.html', { root : path.join(__dirname, "public") });
		}
		else {
			res.redirect('/login')
		}
	}
);

app.get('/login', 
	(req, res) => {
		// if there is NO user within the request... Load the login html page
		if (!req.user) {
			// res.redirect('/logIn.html');
			res.sendFile('logIn.html', { root : path.join(__dirname, "public") });
		}
		else {
			res.redirect('/');
		}
	}
);

app.get('/register',
	(req, res) => {
		// if there is NO user within the request... Load the register html page
		if (!req.user) {
			res.sendFile('register.html', { root : path.join(__dirname, "public") });
		}
		else {
			res.redirect('/');
		}
	}
);

app.get('/logout', (request, response) => { 
	request.logout(); 
	response.redirect('/'); 
});

// HTTP PUT handlers
app.put('/setBettenanzahl', db.setUserHospitalBeds);
app.put('/setFreieBetten', db.setUserFreeHospitalBeds);

app.put('/setBettenanzahl/:hospitalName', db.setHospitalBedsByName);
app.put('/setFreieBetten/:hospitalName', db.setFreeHospitalBedsByName);

app.put('/incrementBettenanzahl/:hospitalName', db.incrementHospitalBedsByName);
app.put('/incrementFreieBetten/:hospitalName', db.incrementFreeHospitalBedsByName);


// HTTP POST handlers
app.post('/login', 
	(req, resp, next) => {
		console.log(req.params);
		console.log(req.body);
		next();
	},

	// middleware that handles tries to login a user and handles the failure case
	passport.authenticate('local', { failureRedirect: '/login' }),

	// function that handles a valid login
	(req, res) => { 
		console.log(req.user);
		res.redirect('/'); 
	}
);

app.post('/register',
	(req, resp, next) => {
		console.log(req.params);
		console.log(req.body);
		next();
	},
	
	(req, resp) => {
		resp.status(205);
		resp.end()
	}
);



// tells express to serve static files from the directory named "public"
app.use(express.static('public'));

/* default entry-point NOTES:

Web servers default entry point is the root directory '/' (i.e. HTTP GET '/')
	WHICH by default is always redirected to 'index.html'
	WHICH because of 'express.static('public')' is always redirected to './public/index.html'

Can override this functionality with:
	app.get('/', 
		(req, res) => {
			// whatever action you want to take... This just returns raw-text
			res.send("this is home")
		}
	);

*/

// override static file get functionality (i.e. don't get 'facivon.ico' from 'public' folder)
app.get('/favicon.ico', (req, res) => {
	res.sendFile('/favicon.ico', { root : __dirname });
});


// 404 response for all unspecified routes (uses regex matching '*')
app.all('*', (request, response) => {
	// console.log(request)
	response.status(404);
	response.send("Wait, that's illegal!");
});

// start the app
app.listen(port, () => { console.log('starting the boi up'); } );