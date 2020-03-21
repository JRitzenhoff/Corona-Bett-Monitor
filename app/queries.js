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

const setBettanzahl = (request, response) => {
    const {
        name,
        amount
    } = request.body;

    pool.query(
        'UPDATE hospitals SET amount = $1 WHERE name = $2',
        [amount, name],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200);
            response.send("")
        }
    )
}

module.exports = {
    getHospitals,
    setBettanzahl
}