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

module.exports = {
    getHospitals
}