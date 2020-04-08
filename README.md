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
        "contact_number": "+9198172398712",
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
    "donald_trump": {
        "user_type": "clinic_admin",
        "email_id": "trump@usa.com",
        "contact_number": "+9198172398712",
        "user_name": "dontrm"
    }
}
```