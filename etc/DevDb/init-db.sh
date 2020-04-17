#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE userdb;
    GRANT ALL PRIVILEGES ON DATABASE userdb TO postgres;
	create table users(
        email_id VARCHAR(20) PRIMARY KEY, 
        password VARCHAR(120), 
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        user_type CHAR NOT NULL, 
        dob DATE NOT NULL,
        address VARCHAR(30) UNIQUE NOT NULL, 
        contact_no VARCHAR(20) NOT NULL); 
EOSQL

