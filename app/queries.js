const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'public_user',
    host: 'localhost',
    database: 'postgres',
    password: 'vUlv2BuDE0tYDY2D4A2q', // this is a terrible idea (in production) as anyone with access to the github can access our database
    port: 5432,
});


const redirectToError = (response) => {
    response.redirect("/internalServerError");
}

const getAttributeOfHospitalIdentifier = (response, attribute, identifier, idval) => {
    // SELECT statement that allows you to GET any attribute from a hospital by name
    const strQuery = 'SELECT ' + attribute + ' FROM hospitals WHERE ' + identifier + ' = $1;';

    pool.query(
        strQuery, 
        [idval],
        
        (err, result) => {
            if (err) {
                redirectToError(response);
                // console.error(err);
            }
            else {
                response.status(200);
                // console.log(result.rows);
                response.json(result.rows);
            }
        }
        
        );
}

const setAttributeOfHospitalIdentifier = (response, attribute, attrVal, identifier, idVal) => {
    // UPDATE statement that allows you to SET any attribute of a hospital by name
    const strPost = 'UPDATE hospitals SET ' + attribute + ' = $1 WHERE ' + identifier + ' = $2;';

    // console.log(strPost, attrVal, idVal);

    pool.query(strPost, 
        [attrVal, idVal], 

        (err, res) => {
        if (err) {
            // response.redirect("/internalServerError")
            // console.error(err);
            redirectToError(response);
        } else {
            response.status(200).send(`Hospital modified with ${attribute}: ${attrVal}`);
        }
    });
}

const setAttributeOfHospital = (attribute, request, response) => {
    // Assume that 'hospitalName' is part of the endpoint (see expanded explanation in 'getAttributeOfHospital' function)
    const name = request.params.hospitalName;

    // Assume that 'amount' is part of the body/passed in data (see expanded explanation in 'setFreeHospitalBedsByName')
    const {
        amount
    } = request.body;

    setAttributeOfHospitalIdentifier(response, attribute, amount, "name", name);
}


const incrementAttributeOfHospital = (attribute, request, response) => {
    const name = request.params.hospitalName;
    const {
        change
    } = request.body;

    const strIncrement = 'UPDATE hospitals SET ' + attribute + ' = ' + attribute + ' + $1 WHERE name = $2;';

    pool.query(strIncrement, 
        [change, name], 
        
        (err, res) => {
        if (err) {
            redirectToError(response);
        }
        else {
            response.status(200);
            response.send('Successfully incremented ' + attribute + ' of ' + name + ' by ' + change);
        }
    });
}


const topValsOfHospitalAttribute = (numVals, attribute, request, response) => {
    // If I don't create the limitStr first, there is an attribute error...
    const limitStr = 'LIMIT ' + numVals + ';';
    const getTopValsStr = 'SELECT name, website, bedcount, freebeds FROM hospitals ORDER BY ' + attribute + ' DESC ' + limitStr;

    pool.query(getTopValsStr, 
        
        (err, res) => {
        if (err) {
            // console.error(err)
            redirectToError(response);
        }
        else {
            response.status(200);
            // console.log(res.rows);
            response.send(res.rows);
        }
    });
}



/* GET METHODS:
------------

Can call with browser hits to: http://localhost:3000/<method>/Klinkum%20Rechts%20der%20Isar

NOTE: %20 == ' ' in URL formatting
*/
const getHospitalBedsByName = (request, response) => {
    // http://localhost:3000/getBettenanzahl/Klinkum%20Rechts%20der%20Isar

    // This is assuming that the 'hospitalName' is part of the endpoint
    const name = request.params.hospitalName;
    getAttributeOfHospitalIdentifier(response, "BedCount", "name", name);
}

const getFreeHospitalBedsByName = (request, response) => {
    // http://localhost:3000/getFreieBetten/Klinkum%20Rechts%20der%20Isar

    // This is assuming that the 'hospitalName' is part of the endpoint
    const name = request.params.hospitalName;
    getAttributeOfHospitalIdentifier(response, "FreeBeds", "name", name);
}

const getTopTenHospitalBedCounts = (request, response) => {
    // console.log("Getting top ten beds");
    // http://localhost:3000/top10FullBeds
    topValsOfHospitalAttribute(10, "BedCount", request, response);
}

const getTopTenHospitalFreeBedCounts = (request, response) => {
    // console.log("Getting top ten FREE beds");
    // http://localhost:3000/top10FreeBeds
    topValsOfHospitalAttribute(10, "FreeBeds", request, response);
}


const getUserHospitalBeds = (request, response) => {
    if (!request.user) {
        response.status(400);
        response.send("No user supplied")
        return;
    }
    
    const id = request.user.hospitalid;

    getAttributeOfHospitalIdentifier(response, "BedCount", "hospitalid", id);
}

const getUserFreeHospitalBeds = (request, response) => {
    if (!request.user) {
        response.status(400);
        response.send("No user supplied");
        return;
    }

    const id = request.user.hospitalid;
    getAttributeOfHospitalIdentifier(response, "FreeBeds", "hospitalid", id);
}

const getUserHospitalName = (request, response) => {
    if (!request.user) {
        response.status(400);
        response.send("No user supplied");
        return;
    }

    const id = request.user.hospitalid;
    getAttributeOfHospitalIdentifier(response, "name", "hospitalid", id);
}




const getSpecificHospital = (request, response) => {
    const region = request.params.region;
    
    const direction = request.params.direction;
    const attribute = request.params.attribute;

    const getDirection = (strInp) => {
        if (strInp == "asc") {
            return "ASC";
        }
        else if (strInp == "desc") {
            return "DESC"
        }
        return null;
    }

    const strDir = getDirection(direction);
    
    // localhost:3000/hospitals/Munich/asc/freebeds
    const strQuery = 'SELECT hospitals.name, hospitals.bedcount, hospitals.freebeds, hospitals.website FROM hospitals LEFT JOIN cities ON hospitals.cityid = cities.cityid LEFT JOIN countries ON cities.CountryID = countries.CountryID WHERE cities.state = $1 OR countries.Name = $2 ORDER BY ' + attribute + ' ' + strDir + ';';
    // console.log("REGION is: " + region);
    // console.log(strQuery);

    // "SELECT hospitals.name, hospitals.bedcount, hospitals.freebeds, hospitals.website FROM hospitals LEFT JOIN cities ON hospitals.cityid = cities.cityid LEFT JOIN countries ON cities.CountryID = countries.CountryID WHERE cities.state = 'Bayern' OR countries.Name = 'Bayern' ORDER BY name ASC;";

    pool.query(strQuery,
        [region,region],
        (err, res) => {
            if (err) {
                // response.redirect("/internalServerError");
                redirectToError(response);
                // console.error(err);
            } else {
                response.status(200).json(res.rows);
            }
        });
}

const httpGetUser = (request, response) => {
    const { username } = request.params;
    const password = "kennywort";

    // this is temporary
    const makeString = (errorValue, resultValue) => { return JSON.stringify({ "err":errorValue, "res":resultValue}); };
    const done = (errorValue, resultValue) => { response.send( makeString(errorValue, resultValue)); }

    fillVerifiedUser(username, password, done);
};

const fillUserByAttribute = (attribute, value, next) => {
    const strQuery = 'SELECT * FROM employee WHERE ' + attribute + ' = $1;';

    pool.query(strQuery,
        [ value ],
        (err, res) => {
            // console.log(res);

            // if an error... return the error
            if (err) { return next(err, null); }

            const { rows } = res;
            // if the response is empty... that means no user
            if (rows.length != 1) { return next(null, false); }

            // there should always only be one row
            const user = rows[0];
            return next(null, user);
        }
    )
}

// acts as middleware by the LocalStrategy
const fillVerifiedUser = (username, password, next) => {
    const passwordCheckNext = (err, user) => {
        if (err) { 
            console.error(err);
            return next(err); 
        }
        if (!user) { 
            console.log("No user found");
            return next(null, false); 
        }
        if (user.passwordhash != password) { 
            console.log("Password incorrect");
            return next(null, false); 
        }
        return next(null, user);
    }

    fillUserByAttribute("name", username, passwordCheckNext);
}

const fillVerifiedUser3 = (parent, username, password, next) => {
    console.log("Found values:", parent, '|', username, '|', password);
    fillVerifiedUser(username, password, next);
}

const fillUserById = (id, done) => {
    // NOTE: The user should always be returned...
    fillUserByAttribute("employeeid", id, done);
}




/* PUT METHODS:
------------

curl -w '\n' -X PUT --data "amount=5" http://localhost:3000/<method>/Klinkum%20Rechts%20der%20Isar

    -w '\n'             : Adds an endline to the return on the console (just for formatting response)
    -X PUT              : Defines what kind of a query it is
    --data "amount=5"   : Populates the body of the request
    http://...          : Is the endpoint to hit
*/
const setHospitalBedsByName = (request, response) => {
    // curl -w '\n' -X PUT --data "amount=1161" http://localhost:3000/setBettenanzahl/Klinkum%20Rechts%20der%20Isar
    setAttributeOfHospital("BedCount", request, response);
}
    
const setFreeHospitalBedsByName = (request, response) => {
    // curl -w '\n' -X PUT --data "amount=5" http://localhost:3000/setFreieBetten/Klinkum%20Rechts%20der%20Isar
    setAttributeOfHospital("FreeBeds", request, response);
}

const setUserHospitalBeds = (request, response) => {
    if (!request.user) {
        response.status(400);
        response.send("No user supplied");
        return;
    }

    const id = request.user.hospitalid;
    const { amount } = request.body;

    setAttributeOfHospitalIdentifier(response, "BedCount", amount, "hospitalid", id);
}

const setUserFreeHospitalBeds = (request, response) => {
    if (!request.user) {
        response.status(400);
        response.send("No user supplied");
        return;
    }

    const id = request.user.hospitalid;
    const { amount } = request.body;
    setAttributeOfHospitalIdentifier(response, "FreeBeds", amount, "hospitalid", id);
}


const incrementHospitalBedsByName = (request, response) => {
    // curl -w '\n' -X PUT --data "change=7" http://localhost:3000/incrementBettenanzahl/Klinkum%20Rechts%20der%20Isar
    incrementAttributeOfHospital("BedCount", request, response);
}

const incrementFreeHospitalBedsByName = (request, response) => {
    // curl -w '\n' -X PUT --data "change=560" http://localhost:3000/incrementBettenanzahl/Klinkum%20Rechts%20der%20Isar
    incrementAttributeOfHospital("FreeBeds", request, response);
}


module.exports = {
    getHospitalBedsByName,
    getFreeHospitalBedsByName,

    getUserHospitalName,
    getUserHospitalBeds,
    getUserFreeHospitalBeds,

    getTopTenHospitalBedCounts,
    getTopTenHospitalFreeBedCounts,

    getSpecificHospital,

    httpGetUser,
    fillVerifiedUser,
    fillVerifiedUser3,
    fillUserById,


    setHospitalBedsByName,
    setFreeHospitalBedsByName,

    setUserHospitalBeds,
    setUserFreeHospitalBeds,

    incrementHospitalBedsByName,
    incrementFreeHospitalBedsByName,
}