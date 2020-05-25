# Bodhi-UserService
## Overview
This Service is used to manage users of Bodhi application.

## Sample User request
#### Create User:
```
    {
        "email_id": "super@bodhi.com",   
        "password":"default-password-is-to-be-changed",
        "first_name":"Super",
        "last_name":"Admin",
        "user_type": "S",
        "contact_no": "+61000000000",
        "dob":"1970-01-01",
        "address":"Bodhi, USA"
    }
    {
        "email_id": "Admin@usa.com",   
        "password":"a123",
        "first_name":"Clinic",
        "last_name":"Admin",
        "user_type": "A",
        "contact_no": "+9198172398712",
        "dob":"1950-10-10",
        "address":"White house, USA",
        "clinic_id":"5eab42762d4e1b4db8fd6a8c"
    }
    {
        "email_id": "user1@usa.com",   
        "password":"u1123",
        "first_name":"User",
        "last_name":"1",
        "user_type": "U",
        "contact_no": "+9198172398712",
        "dob":"1950-10-10",
        "address":"White house, USA",
        "clinic_id":"5eab42762d4e1b4db8fd6a8c"
    }
    {
        "email_id": "user2@usa.com",   
        "password":"u2123",
        "first_name":"User",
        "last_name":"2",
        "user_type": "P",
        "contact_no": "+9198172398712",
        "dob":"1950-10-10",
        "address":"White house, USA"
    }
```
### input for authentication
```
{"email_id":"shawn@bodhi.com","password":"sysAdmin123"}
{"email_id": "peter@bodhi.com","password":"sysAdmin123"}
{"email_id": "clark@bodhi.com","password":"sysAdmin123"}
{"email_id": "super@bodhi.com","password":"default-password-is-to-be-changed"}
```

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

## migration
```
$ ./node_modules/.bin/env-cmd -f ./config/linux.env npx sequelize-cli db:migrate
```