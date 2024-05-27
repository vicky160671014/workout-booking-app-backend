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
| image |   | file | User image |
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
## POST /api/trainers/create (apply to be trainer)  
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
| appointment | Required | json | enter the time (week) when lessons are available. Use an array [1,2,3,4,5,6,0] to represent Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday(0) respectively. |
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
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Appointment is wrong format."
}
```
## PUT /api/trainers/:trainerId (modify trainer information)  
modify trainer's own information  
  
(authentication is required)
### Path Variables  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| trainerId | Required | int | trainer id |
### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | | string | trainer name |
| introduction | | text | trainer introduction |
| teachingStyle | | text | teaching style |
| duringTime | | string | can only fill in 30 or 60 |
| location | | string | enter the actual teaching address |
| appointment | | json | enter the time (week) when lessons are available. Use an array [1,2,3,4,5,6,0] to represent Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday(0) respectively. |
| image | | file | trainer image |
### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "trainer": {
            "id": 1,
            "name": "vicky pilates",
            "image": "/upload/FB_IMG_1475851963380.jpg",
            "introduction": "STOTT PILATES Rehab is a full-body, systemic approach to post-rehab exercise using small props and a wide variety of space-saving equipment",
            "teachingStyle": "Matwork & Matwork with Small Equipment",
            "duringTime": "60",
            "location": "new taipei",
            "appointment": [
                2,
                4
            ],
            "userId": 1,
            "createdAt": "2024-05-21T08:09:32.000Z",
            "updatedAt": "2024-05-21T12:44:52.184Z"
        }
    }
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Trainer didn't exist!"
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Appointment is wrong format."
}
```
## POST /api/records (user make an appointment)  
user make an appointment  
  
(authentication is required)  
### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| trainerId | Required | string | trainer's ID |
| appointment | Required | string | Submit start time.For example, if user want to make an appointment "2024-5-21 20:00:00" to "2024-5-21 21:00:00", please submit "2024-5-21 20:00:00."|
```json
{
    "trainerId": "2",
    "appointment":"2024-5-21 20:00:00"
}
```
### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "record": {
            "id": 18,
            "startTime": "2024-05-22 18:00",
            "duringTime": "30",
            "userId": 1,
            "trainerId": 3,
            "updatedAt": "2024-05-24T07:35:57.992Z",
            "createdAt": "2024-05-24T07:35:57.992Z"
        }
    }
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Not open during this week day"
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Unable to book a trainer's own lesson"
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: User appointments overlap"
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: This time slot has been reserved"
}
```
## DELETE /api/records/:recordId (cancel appointment)  
user can cancel the appointment  
  
(authentication is required)
### Path Variables  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| recordId | Required | int | record id |
### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "deleteRecord": {
            "id": 22,
            "startTime": "2024-05-21 20:00",
            "duringTime": "60",
            "userId": 1,
            "trainerId": 2,
            "createdAt": "2024-05-24T07:39:02.000Z",
            "updatedAt": "2024-05-24T07:39:02.000Z"
        }
    }
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Unable to delete other user's record!"
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: Record didn't exist!"
}
```
## POST /api/comments (comment)  
user can score and leave a comment about the trainer 
  
(authentication is required)
### Request Body  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| trainerId | Required | string | trainer's ID |
| scores | Required | int | enter a rating of 1-5 points|
| text | Required | text | write a comment for trainer|
```json
{
    "trainerId":"2",
    "scores":"5",
    "text":"great!"
}
```
### Response 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "comment": {
            "id": 1,
            "scores": "5",
            "text": "great!",
            "userId": 1,
            "trainerId": "2",
            "updatedAt": "2024-05-27T08:44:55.085Z",
            "createdAt": "2024-05-27T08:44:55.085Z"
        }
    }
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: User has no record of this trainer"
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
    "message": "Error: Please fill in the score from 1 to 5 points"
}
```
