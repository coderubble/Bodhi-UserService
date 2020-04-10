# Bodhi-UserService
## Overview
This Service is used to manage users of Bodhi application.

### Example of a User request
#### Patient:
```
 {
    "donald_trump": {
        "user_type": "patient",
        "email_id": "trump@usa.com",
        "contact_no": "+9198172398712",
        "user_name": "dontrm",
        "first_name":"Donald",
        "last_name":"Trump",
        "dob":"10-10-1950",
        "address":"White house, USA"
    }
}
```

#### Clinic Admin
```
{
	"user_name": "donald_trump",
	"user_type": "C",
	"email_id": "trump@usa.com",
	"contact_no": "+9198172398712"
}
```

## Database

#### Starting postgres on docker 
``` docker run -d -p 5432:5432 --name userdb -e POSTGRES_PASSWORD=mysecretpassword postgres ```

#### Connecting from within docker 
``` 
$ docker exec -it userdb bash;
$ psql -U postgres;
$ create database userdb;
$ \c userdb;
$ create table users(user_name VARCHAR(20) PRIMARY KEY, user_type CHAR NOT NULL, email_id VARCHAR(30) UNIQUE NOT NULL, contact_no VARCHAR(20) NOT NULL); 
```

#### Connecting from outside docker

```
$ psql -h <use the docker IP> -p 5432 -U postgres -W  
```
#### Connection URl

```
postgres://YourUserName:YourPassword@YourHost:5432/YourDatabase"
```


https://github.com/slanatech/swagger-stats
