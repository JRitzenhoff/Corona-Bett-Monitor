const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'public_user',
    host: 'localhost',
    database: 'postgres',
    password: 'vUlv2BuDE0tYDY2D4A2q', // this is a terrible idea
    port: 5432,
});


const getAttributeOfHospital = (attribute, request, response) => {
    const name = request.params.hospitalName;

    // create the select statement that works for both keys
    const strQuery = 'SELECT ' + attribute + ' FROM hospitals WHERE name = $1;';
    console.log(strQuery)

    pool.query(strQuery,
        [name],
        (err, res) => {
            if (err) {
                console.error(err);
                response.redirect("/internalServerError");
            } else {
                console.log(res);
                response.status(200).json(res.rows);
            }
        });
}


const getHospitalBedsByName = (request, response) => {
    getAttributeOfHospital("BedCount", request, response)
}

const getFreeHospitalBedsByName = (request, response) => {
    getAttributeOfHospital("FreeBeds", request, response);
}


const setAttributeOfHospital = (attribute, request, response) => {
    const name = request.params.hospitalName;
    const {
        amount
    } = request.body;

    // Generate the post string
    /*const strPost = 'UPDATE hospitals SET ' + attribute + ' = $1 WHERE name = $2;';

    pool.query(str_post, [amount, name], (err, res) => {
        if (err) {
            console.error(err)
        } else {
            response.status(200).send(`Hospital modified with name: ${name}`)
        }
    });*/

    const strPost = 'UPDATE hospitals SET $1 = $2 WHERE name = $3;';

    pool.query(strPost, [attribute, amount, name], (err, res) => {
        if (err) {
            response.redirect("/internalServerError");
        } else {
            response.status(200);
            response.send('Successfully set ' + attribute + ' of ' + name + ' to ' + amount);
        }
    });
}

const setTotalBeds = (request, response) => {
    setAttributeOfHospital("BedCount", request, response);
}

const setFreeBeds = (request, response) => {
    setAttributeOfHospital("FreeBeds", request, response)

}

/*
const incrementUsedBeds = (request, response) => {
    const name = request.params.hospitalName;
    const {
        change
    } = request.body

    // curl -X PUT -d "name=Easy" -d "change=1" http://localhost:3000/users/1
    // curl -X PUT -d "change=2" http://localhost:3000/incrementBettenanzahl/Easy
        curl -X PUT -d "amount=2" http://localhost:3000/setBettenanzahl/Klinkum%20Rechts%20der%20Isar
    // Get the number of used beds currently in the database
    const raw_used_beds = getFreeHospitalBeds({
            "hospitalName": name
        },
        response)

    const used_beds = parseInt(raw_used_beds)
}*/


module.exports = {
    getHospitalBedsByName,
    getFreeHospitalBedsByName,
    setFreeBeds,
    setTotalBeds
}