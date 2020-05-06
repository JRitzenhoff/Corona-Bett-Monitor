
# Summary

This is an app that is designed to help individuals figure find hospitals that have available beds and breathing machines.

It is meant to be a platform where officials within the hospitals can easily and securely upload data. Citizens can then reduce the chance of not being treated by going directly to hospitals that have room.


# Technical Specifics

## Design
* CLoud: Digital Ocean
* Server: Nginx (Reverse Proxy)
* Database: PostGreSQL
* Programming Language: NodeJS

## Setting Up Developer Environment Locally
### Downloading what you need
1. install nodejs
    * npm installs as a part of the nodejs
1. install PostGreSQL

### Initializing states
NOTE: make sure you are in the `app` directory

* `npm install`
<br></br>
* login into PostGreSQL
    * `sudo -u postgres psql`
    * NOTE: If psql server is not running, it can be started with `sudo service postgresql start`
* create the public_user (FOLLOW EVERY LINE WITH `;`)

   NOTE: You can see what users you have with the command `\du`
    * `CREATE ROLE public_user;`
    * `ALTER ROLE public_user WITH PASSWORD` actual_pass`;`
    * `ALTER ROLE public_user WITH LOGIN;`
    
    NOTE: Currently the password for the public_user is saved within `queries.js`
    * `GRANT ALL PRIVILEGES ON TABLE hospitals TO public_user;`
    * `GRANT ALL PRIVILEGES ON TABLE cities TO public_user;`
    * `GRANT ALL PRIVILEGES ON TABLE countries TO public_user;`
    * `GRANT ALL PRIVILEGES ON TABLE employee TO public_user;`
    

* update the database
   * `\i ` path to hospitals_build.sql (it's in the database folder)
   * `\i ` path to create_dummies.sql (it's in the database folder)
   
   NOTE: You can see what databases you have with the command `\db`

   NOTE: You can see what values are in the database with a SQL statement... Like: `SELECT * FROM hospitals;`

* log out of PostGreSQL user postgres
   * `\q`
   
    

## Running the code locally
1. `node server.js`
    * Runs the code on _localhost:3000_

# NOTE TO SELF:

Don't forget to add/uncomment the service-worker link to index.html
