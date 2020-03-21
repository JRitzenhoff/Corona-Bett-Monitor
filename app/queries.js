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

const getHospital = (request, response) => {
    // get the field from the reqeust
    const { name } = request.body

    // Actually make the SQL query
    //  This should only return a single element (within a list though)
    pool.query('SELECT * FROM hospitals WHERE name == $1', [ name ], 
    (error, results) => {
        if (error) {
            throw error;
        }
        
        // Results will be a matrix?
        response.status(200).json(results.rows);
    });

}

module.exports = {
    getHospitals,
    getHospital
}