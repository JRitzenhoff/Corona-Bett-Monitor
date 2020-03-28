const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'public_user',
    host: 'localhost',
    database: 'postgres',
    password: 'vUlv2BuDE0tYDY2D4A2q', // this is a terrible idea
    port: 5432,
});


const redirectToError = (response) => {
    response.redirect("/internalServerError");
}

const getAttributeOfHospital = (attribute, request, response) => {
    // This is assuming that the 'hospitalName' is part of the endpoint
    const name = request.params.hospitalName;

    // SELECT statement that allows you to GET any attribute from a hospital by name
    const strQuery = 'SELECT ' + attribute + ' FROM hospitals WHERE name = $1;';

    pool.query(
        strQuery, 
        [name],
        
        (err, result) => {
            if (err) {
                redirectToError(response);
                // console.error(err);
            }
            else {
                response.status(200);
                response.json(result.rows);
            }
        }
        
        );
}

const setAttributeOfHospital = (attribute, request, response) => {
    // Assume that 'hospitalName' is part of the endpoint (see expanded explanation in 'getAttributeOfHospital' function)
    const name = request.params.hospitalName;

    // Assume that 'amount' is part of the body/passed in data (see expanded explanation in 'setFreeHospitalBedsByName')
    const {
        amount
    } = request.body;

    // UPDATE statement that allows you to SET any attribute of a hospital by name
    const strPost = 'UPDATE hospitals SET ' + attribute + ' = $1 WHERE name = $2;';

    pool.query(strPost, 
        [amount, name], 

        (err, res) => {
        if (err) {
            // response.redirect("/internalServerError")
            redirectToError(response);
        } else {
            response.status(200).send(`Hospital modified with name: ${name}`);
        }
    });
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
    getAttributeOfHospital("BedCount", request, response);
}

const getFreeHospitalBedsByName = (request, response) => {
    // http://localhost:3000/getFreieBetten/Klinkum%20Rechts%20der%20Isar
    getAttributeOfHospital("FreeBeds", request, response);
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

const getSpecificHospital = (request, response) => {
    const city = request.params.city;
    const direction = request.params.direction;
    const attribute = request.params.attribute;

    // console.log(city + " | " + direction + " | " + attribute)

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
    const strQuery = 'SELECT hospitals.name, hospitals.bedcount, hospitals.freebeds FROM hospitals LEFT JOIN cities ON hospitals.cityid = cities.cityid WHERE cities.name = $1 ORDER BY ' + attribute + ' ' + strDir + ';';

    pool.query(strQuery,
        [city],
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

    getTopTenHospitalBedCounts,
    getTopTenHospitalFreeBedCounts,

    getSpecificHospital,


    setHospitalBedsByName,
    setFreeHospitalBedsByName,

    incrementHospitalBedsByName,
    incrementFreeHospitalBedsByName
}