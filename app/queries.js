const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'public_user',
    host: 'localhost',
    database: 'postgres',
    password: 'vUlv2BuDE0tYDY2D4A2q', // this is a terrible idea
    port: 5432,
});


const getHospitals = (request, response) => {
    pool.query('SELECT * FROM hospitals;', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getHospitalBeds = (fieldKey, request, response) => {
    const name = request.params.hospitalName

    // create the select statement that works for both keys
    const str_query = 'SELECT ' + fieldKey + ' FROM hospitals WHERE name = $1'

    pool.query(str_query,
    [ name ],
    (err, res) => {
        if (err) {
            console.error(err);
            response.json({err_val: err.stack});
        }
        else {
            // console.log(res);
            response.status(200).json(res.rows);
        }
    });
}

const getTotalHospitalBeds = (request, response) => {
    getHospitalBeds("BedCount", request, response)
}

const getFreeHospitalBeds = (request, response) => {
    getHospitalBeds("FreeBeds", request, response);
}




const setHospitalBeds = (fieldKey, request, response) => {
    const name = request.params.hospitalName
    const { amount } = request.body

    // Generate the post string
    const str_post = 'UPDATE hospitals SET ' + fieldKey + ' = $1 WHERE name = $2'

    pool.query(str_post, [ amount, name ], (err, res) => {
        if (err) {
            console.error(err)
        }
        else {
            response.status(200).send(`Hospital modified with name: ${name}`)
        }
    });
}

const setTotalHospitalBeds = (request, response) => {
    // curl -w '\n' -X PUT -d "amount=10" http://localhost:3000/setBettenanzahl/Easy
    setHospitalBeds("BedCount", request, response)
}

const setFreeHospitalBeds = (request, response) => {
    // curl -w '\n' -X PUT -d "amount=10" http://localhost:3000/setFreieBetten/Easy
    setHospitalBeds("FreeBeds", request, response)
}



const incrementUsedBeds = (request, response) =>
{
    const name = request.params.hospitalName
    const { change } = request.body

    // Get the number of used beds currently in the database
    const raw_used_beds = getFreeHospitalBeds(
        {"hospitalName" : name}, 
        response)

    const used_beds = parseInt(raw_used_beds)
}


module.exports = {
    getHospitals,

    getFreeHospitalBeds,
    getTotalHospitalBeds,

    setFreeHospitalBeds,
    setTotalHospitalBeds
}