# Database

## alias
```
alias clean="docker rm -f userdb && docker rmi userdb"
```
## clean start
```
clean 
docker build -t userdb .
```

## Starting postgres on docker 
```
docker volume create \
--driver local \
--label example=cassandra \
cass-shared

docker volume create \
--driver local \
--label example=pg \
localpg

PGDATA=/var/lib/postgresql/data/pgdata 
winpty docker run -d \
-p 5432:5432 \
--name userdb \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=postgres \
-e POSTGRES_PASSWORD=mysecretpassword \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v localpg:/var/lib/postgresql/data/pgdata \
userdb


docker run -d \
--volume localpg:/var/lib/postgresql/data/pgdata \
-p 5432:5432 \
--name userdb \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=postgres \
-e POSTGRES_PASSWORD=mysecretpassword \
-e PGDATA=/var/lib/postgresql/data/pgdata \
userdb
```

## Connecting from within docker 
``` 
$ docker exec -it userdb bash;
$ psql -U postgres;
$ create database userdb;
$ \c userdb;
$ create table users(user_name VARCHAR(20) PRIMARY KEY, user_type CHAR NOT NULL, email_id VARCHAR(30) UNIQUE NOT NULL, contact_no VARCHAR(20) NOT NULL); 
```

## Connecting from outside docker

```
$ psql -h <use the docker IP> -p 5432 -U postgres -W  
```
## Connection URL

```
postgres://YourUserName:YourPassword@YourHost:5432/YourDatabase"
```
