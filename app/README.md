
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

* npm install
* login into PostGreSQL
    * sudo -u postgres psql
* create the public_user (FOLLOW EVERY LINE WITH `;`)
    * CREATE ROLE public_user;
    * ALTER ROLE public_user WITH PASSWORD 'actual_pass';
    * GRANT ALL PRIVILEGES ON TABLE postgress TO public_user;

## Running the code locally
1. `node server.js`
    * Runs the code on _localhost:3000_

# NOTE TO SELF:

Don't forget to add/uncomment the service-worker link to index.html