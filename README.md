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
```
## Docker
#### Testing on Docker 
```
$ docker build -t bodhi_user_service .
$ docker run --rm \
-e JWT_PRIVATE_KEY=myprivatekey \
-e PORT=3000 \
-e DATABASE_URL=postgres://postgres:mysecretpassword@192.168.99.100:5432/userdb \
-e SALT=10 \
--name bodhi_user_service \
-p 3030:3000 \
bodhi_user_service
```

#### Starting postgres on docker 
```
see [Docs](Docs/DevDb/)
```

## TODO 
* write integeration test project
* https://github.com/slanatech/swagger-stats