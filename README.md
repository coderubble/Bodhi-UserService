# Bodhi-UserService
## Overview
This Service is used to manage users of Bodhi application.

### Sample User request
#### Create User:
```
 {
    "email_id": "trump@usa.com",   
    "password":"trump123",
    "first_name":"Donald",
    "last_name":"Trump",
    "user_type": "S",
    "contact_no": "+9198172398712",
    "dob":"10-10-1950",
    "address":"White house, USA"
}
```
### input for authentication
```{"email_id": "trump@usa.com","password":"trump123"}```

## Docker
#### Testing on Docker 
```
$ docker build -t bodhi_user_service .
$ docker run --rm \
-e JWT_PRIVATE_KEY=myprivatekey \
-e PORT=3000 \
-e DATABASE_URL=postgres://postgres:mysecretpassword@192.168.99.101:5432/postgres \
-e SALT=10 \
--name bodhi_user_service \
-p 3030:3000 \
bodhi_user_service
```
## Commiting, tagging and pushing.
$ version=1.0
$ image=coderubble/bodhi_user_service
$ docker commit bodhi_user_service $image:$version
$ docker tag $image:$version 
$ docker push $image:$latest 
#### Starting postgres on docker 
```
see [Docs](Docs/DevDb/)
```

## TODO 
* write integeration test project
* https://github.com/slanatech/swagger-stats