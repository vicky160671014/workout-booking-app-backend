# User  

## POST /api/signup (user signup)  
user sign up.  

### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | User name |
| email | Required | string | User email |
| password | Required | string | User password |
| confirmPassword | Required | string | retype the password |

### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": 2,
            "name": "user02",
            "email": "user02@example.com",
            "updatedAt": "2024-05-15T07:39:47.760Z",
            "createdAt": "2024-05-15T07:39:47.760Z"
        }
    }
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: Email already exists!"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: Passwords do not match!"
}
```
## POST /api/signin (user signin)  
user sign in.  
### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| email | Required | string | User email |
| password | Required | string | User password |  

### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImJvYiIsImVtYWlsIjoicm9vdEBleGFtcGxlLmNvbSIsImltYWdlIjpudWxsLCJpbnRyb2R1Y3Rpb24iOm51bGwsImNyZWF0ZWRBdCI6IjIwMjQtMDUtMTVUMDc6MTI6NDguMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDUtMTVUMDc6MTI6NDguMDAwWiIsImlhdCI6MTcxNTc4MjYzNCwiZXhwIjoxNzE4Mzc0NjM0fQ.t9YsUMwBmNGF1yCfqPuDRGM0UBw4rUU22Ouiaij4MYw",
        "user": {
            "id": 1,
            "name": "bob",
            "email": "root@example.com",
            "image": null,
            "introduction": null,
            "createdAt": "2024-05-15T07:12:48.000Z",
            "updatedAt": "2024-05-15T07:12:48.000Z"
        }
    }
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: Email or password wrong!"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: Have not registered"
}
```

## GET /api/users/:userId (user info)  
get user info  
  
(authentication is required)

### Path Variables  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| userId | Required | int | user id |

### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": 1,
            "name": "AOA",
            "email": "root@example.com",
            "image": "/upload/104506_81750082.jpg",
            "introduction": "hlihwqlihlhdlnlaksjasdlsakjdklj",
            "createdAt": "2024-05-15T07:12:48.000Z",
            "updatedAt": "2024-05-16T13:48:58.000Z"
        }
    }
}
```
Failure Response | code : 401  
```json
{
    "status": "error",
    "message": "unauthorized"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "User didn't exist!"
}
```

## PUT /api/users/:userId (update user info)  
update user info  
  
(authentication is required)
### Path Variables  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| userId | Required | int | user id |
### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | User name |
| introduction |   | string | User password |
| image |   | file | User name |
### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "user": {}
    }
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "User name is required!"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error, you can only modify your own information"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "User didn't exist!"
}
```
## POST /api/trainer/create (apply to be trainer)  
apply to be trainer  
  
(authentication is required)
### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | trainer name |
| introduction | Required | text | trainer introduction |
| teachingStyle | Required | text | teaching style |
| duringTime | Required | string | can only fill in 30 or 60 |
| location | Required | string | enter the actual teaching address |
| appointment | Required | json | enter the time (week) when lessons are available. Use an array [1,2,3,4,5,6,7] to represent Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday respectively. |
### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "trainer": {
            "id": 1,
            "name": "vicky pilates",
            "introduction": "STOTT PILATES Rehab is a full-body, systemic approach to post-rehab exercise using small props and a wide variety of space-saving equipment",
            "teachingStyle": "Matwork & Matwork with Small Equipment",
            "duringTime": "60",
            "location": "taipei",
            "appointment": [
                2,
                4
            ],
            "image": "/upload/104506_81750082.jpg",
            "userId": 1,
            "updatedAt": "2024-05-21T08:09:32.571Z",
            "createdAt": "2024-05-21T08:09:32.571Z"
        }
    }
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: Already have a trainer status!"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: All fields are required"
}
```
Failure Response | code : 500  
```json
{
    "status": "error",
    "message": "Error: You can only fill in 30 minutes or 60 minutes"
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: User didn't exist!"
}
```