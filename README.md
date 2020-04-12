# Bodhi-UserService
## Overview
This Service is used to manage users of Bodhi application.

### Example of a User request
#### User:
```
 {
    "email_id": "trump@usa.com",   
    "password":"trump123",
    "first_name":"Donald",
    "last_name":"Trump",
    "user_type": "P",
    "contact_no": "+9198172398712",
    "dob":"10-10-1950",
    "address":"White house, USA"
}



#### Starting postgres on docker 
 docker run -d \
    -p 5432:5432 \
    --name userdb \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /C/Softwares/PostgreSQL/data:/var/lib/postgresql/data/pgdata \
    userdb

## TODO 
* add env properties for local environments
* define the layers to test 
* write integeration test project
* https://github.com/slanatech/swagger-stats