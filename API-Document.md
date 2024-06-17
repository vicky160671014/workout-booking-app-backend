# Workout Booking APP - API Document<!-- omit in toc -->

## Table of contents<!-- omit in toc -->
- [ERD (Entity Relationship Diagram)](#erd-entity-relationship-diagram)
- [User](#user)
  - [POST /api/signup (User signup)](#post-apisignup-user-signup)
  - [POST /api/signin (User signin)](#post-apisignin-user-signin)
  - [GET /api/users/:userId (User info)](#get-apiusersuserid-user-info)
  - [PUT /api/users/:userId (Update user info)](#put-apiusersuserid-update-user-info)
- [Trainer](#trainer)
  - [POST /api/trainers/create (Apply to be trainer)](#post-apitrainerscreate-apply-to-be-trainer)
  - [PUT /api/trainers/:trainerId (Modify trainer information)](#put-apitrainerstrainerid-modify-trainer-information)
  - [GET /api/trainers/:trainerId (Trainer info)](#get-apitrainerstrainerid-trainer-info)
- [Record](#record)
  - [POST /api/records (User make an appointment)](#post-apirecords-user-make-an-appointment)
  - [DELETE /api/records/:recordId (User cancel appointment)](#delete-apirecordsrecordid-user-cancel-appointment)
- [Comment](#comment)
  - [POST /api/comments (Comment)](#post-apicomments-comment)
- [Lesson](#lesson)
  - [GET /api/lessons (User home page)](#get-apilessons-user-home-page)
  - [GET /api/lessons/:trainerId (User gets available lesson and trainer info)](#get-apilessonstrainerid-user-gets-available-lesson-and-trainer-info)
  - [GET /api/lessons/search (Search)](#get-apilessonssearch-search)
- [Admin](#admin)
  - [POST /api/admin/signin (Admin signin)](#post-apiadminsignin-admin-signin)
  - [GET /api/admin (Admin get all users)](#get-apiadmin-admin-get-all-users)


# ERD (Entity Relationship Diagram)
  
```mermaid
erDiagram
    USER {
        INTEGER id PK
        STRING name
        STRING email
        STRING password
        STRING image
        TEXT introduction
    }
    
    TRAINER {
        INTEGER id PK
        STRING name
        STRING image
        TEXT introduction
        TEXT teachingStyle
        STRING duringTime
        STRING location
        JSON appointment
        INTEGER userId FK
    }
    
    RECORD {
        INTEGER id PK
        STRING startTime
        STRING duringTime
        INTEGER userId FK
        INTEGER trainerId FK
    }
    
    COMMENT {
        INTEGER id PK
        FLOAT scores
        TEXT text
        INTEGER userId FK
        INTEGER trainerId FK
    }
    
    ADMIN {
        INTEGER id PK
        STRING name
        STRING email
        STRING password
    }
    
    USER ||--o| TRAINER : "has one"
    USER ||--o{ RECORD : "has many"
    USER ||--o{ COMMENT : "has many"
    TRAINER ||--o{ RECORD : "has many"
    TRAINER ||--o{ COMMENT : "has many"
```

# User  

## POST /api/signup (User signup)  
User sign up.  

### Request Body<!-- omit in toc -->
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | User name |
| email | Required | string | User email |
| password | Required | string | User password |
| confirmPassword | Required | string | retype the password |

### Response<!-- omit in toc -->
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
## POST /api/signin (User signin)  
User sign in.  
### Request Body<!-- omit in toc --> 
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| email | Required | string | User email |
| password | Required | string | User password |  

### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjgsIm5hbWUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAZXhhbXBsZS5jb20iLCJpbWFnZSI6Imh0dHBzOi8vbG9yZW1mbGlja3IuY29tLzE1MC8xNTAvaHVtYW4vP3JhbmRvbT02Mi43MzUyOTg3NjUzODAzMzUiLCJpbnRyb2R1Y3Rpb24iOiJjdW0iLCJjcmVhdGVkQXQiOiIyMDI0LTA2LTA4VDA2OjEzOjExLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTA2LTA4VDA2OjEzOjExLjAwMFoiLCJpYXQiOjE3MTgyODk2MTcsImV4cCI6MTcyMDg4MTYxN30.ev7REfSHCfHYNJxKPgxo_xVgRrrHKR7wyHJLdGgvxuE",
        "user": {
            "id": 68,
            "name": "user1",
            "email": "user1@example.com",
            "image": "https://loremflickr.com/150/150/human/?random=62.735298765380335",
            "introduction": "cum",
            "createdAt": "2024-06-08T06:13:11.000Z",
            "updatedAt": "2024-06-08T06:13:11.000Z"
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

## GET /api/users/:userId (User info)  
Get user info, recent reservation in future, awaiting comment list, personal rank about total lesson time.  
  
(authentication is required)

### Path Variables<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| userId | Required | int | user id |

### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": 68,
            "name": "user1",
            "email": "user1@example.com",
            "image": "https://loremflickr.com/150/150/human/?random=62.735298765380335",
            "introduction": "cum",
            "createdAt": "2024-06-08T06:13:11.000Z",
            "updatedAt": "2024-06-08T06:13:11.000Z",
            "isTrainer": {
                "id": 44,
                "name": "Faith Lebsack",
                "image": "https://loremflickr.com/150/150/human/?random=57.45773391794711",
                "introduction": "Placeat omnis distinctio sed eos laboriosam. Voluptatum officia maiores qui. At officia est sint vitae eveniet ut. Et eum eligendi dolore velit a dolor excepturi quasi. Occaecati natus ad reprehenderit est dolores temporibus porro quia. Sint eos temporibus nemo.",
                "teachingStyle": "Eveniet ex consectetur rerum qui.",
                "duringTime": "30",
                "location": "45384 Brigitte Street",
                "appointment": [
                    3,
                    4,
                    5
                ],
                "userId": 68,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            }
        },
        "newReservation": [
            {
                "id": 649,
                "startTime": "2024-06-21 20:00",
                "duringTime": "60",
                "userId": 68,
                "trainerId": 45,
                "createdAt": "2024-06-12T12:50:59.000Z",
                "updatedAt": "2024-06-12T12:50:59.000Z",
                "Trainer": {
                    "id": 45,
                    "name": "Mr. Sheri Huel",
                    "image": "https://loremflickr.com/150/150/human/?random=98.67364676095328",
                    "introduction": "Consectetur quibusdam illo quis incidunt voluptas aliquid.\nEt ut hic mollitia ullam nisi.\nAutem recusandae consectetur natus quis a quibusdam rerum alias ipsa.\nEa ipsam aperiam ut voluptatem.\nSit quidem corporis culpa ea.",
                    "teachingStyle": "qui",
                    "duringTime": "60",
                    "location": "4524 Laney Crest",
                    "appointment": [
                        3,
                        4,
                        5
                    ],
                    "userId": 69,
                    "createdAt": "2024-06-08T06:13:13.000Z",
                    "updatedAt": "2024-06-08T06:13:13.000Z"
                }
            }
        ],
        "awaitCommentRecord": [
            {
                "trainerId": 62,
                "Trainer": {
                    "name": "Sheila Gusikowski",
                    "image": "https://loremflickr.com/150/150/human/?random=95.51904097367823"
                }
            },
            {
                "trainerId": 50,
                "Trainer": {
                    "name": "Ronnie Hoeger",
                    "image": "https://loremflickr.com/150/150/human/?random=19.818182384283723"
                }
            },
            {
                "trainerId": 61,
                "Trainer": {
                    "name": "Mathew Kling",
                    "image": "https://loremflickr.com/150/150/human/?random=60.87980797848444"
                }
            }
        ],
        "myRankIndex": 9
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

## PUT /api/users/:userId (Update user info)  
User can update user info  
  
(authentication is required)
### Path Variables<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| userId | Required | int | user id |
### Request Body<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | User name |
| introduction |   | string | User password |
| image |   | file | User image |
### Response<!-- omit in toc --> 
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
# Trainer

## POST /api/trainers/create (Apply to be trainer)  
User can apply to be trainer  
  
(authentication is required)
### Request Body<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | Required | string | trainer name |
| introduction | Required | text | trainer introduction |
| teachingStyle | Required | text | teaching style |
| duringTime | Required | string | can only fill in 30 or 60 |
| location | Required | string | enter the actual teaching address |
| appointment | Required | json | enter the time (week) when lessons are available. Use an array [1,2,3,4,5,6,0] to represent Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday(0) respectively. |
### Response<!-- omit in toc --> 
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
## PUT /api/trainers/:trainerId (Modify trainer information)  
Modify trainer's own information  
  
(authentication is required)
### Path Variables<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| trainerId | Required | int | trainer id |
### Request Body<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| name | | string | trainer name |
| introduction | | text | trainer introduction |
| teachingStyle | | text | teaching style |
| duringTime | | string | can only fill in 30 or 60 |
| location | | string | enter the actual teaching address |
| appointment | | json | enter the time (week) when lessons are available. Use an array [1,2,3,4,5,6,0] to represent Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday(0) respectively. |
| image | | file | trainer image |
### Response<!-- omit in toc --> 
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
## GET /api/trainers/:trainerId (Trainer info) 
Get the trainer's own information including:  
- trainer's basic information
- all records about the trainer
- records in future(7 days after today)
- all comments about the trainer
- average comment score  
  
(authentication is required)
### Path Variables<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| trainerId | Required | int | trainer id |
### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "trainer": {
            "id": 24,
            "name": "Jonathon Robel",
            "image": "https://loremflickr.com/150/150/human/?random=44.744889667154794",
            "introduction": "sit",
            "teachingStyle": "Mollitia et quia id doloremque aut consequuntur et sit dolores. Provident sed et alias soluta suscipit mollitia sit quo. Quis et asperiores. Velit sapiente enim.\n \rQuas amet est beatae distinctio magnam vel veritatis praesentium in. Sed numquam cupiditate vero quod exercitationem expedita. Est illo perferendis qui quidem vel.\n \rCulpa et suscipit est et doloremque rerum. Sed consequatur sed. Exercitationem necessitatibus temporibus. Provident beatae voluptates minus ut molestiae.",
            "duringTime": "30",
            "location": "834 Dooley Run",
            "appointment": [
                1,
                3,
                5
            ],
            "userId": 37,
            "createdAt": "2024-06-06T08:14:28.000Z",
            "updatedAt": "2024-06-06T08:14:28.000Z"
        },
        "allRecords": [
            {
                "id": 470,
                "startTime": "2023-12-22 18:30",
                "duringTime": "30",
                "userId": 59,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 468,
                "startTime": "2023-12-29 18:30",
                "duringTime": "30",
                "userId": 58,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 463,
                "startTime": "2024-01-12 18:00",
                "duringTime": "30",
                "userId": 56,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 385,
                "startTime": "2024-05-30 18:00",
                "duringTime": "30",
                "userId": 62,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 386,
                "startTime": "2024-05-30 18:30",
                "duringTime": "30",
                "userId": 40,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 325,
                "startTime": "2024-06-07 18:30",
                "duringTime": "30",
                "userId": 42,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 326,
                "startTime": "2024-06-07 19:00",
                "duringTime": "30",
                "userId": 43,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 327,
                "startTime": "2024-06-07 19:30",
                "duringTime": "30",
                "userId": 45,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            }
        ],
        "currentRecordSort": [
            {
                "id": 325,
                "startTime": "2024-06-07 18:30",
                "duringTime": "30",
                "userId": 42,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z",
                "Trainer": {
                    "id": 24,
                    "name": "Jonathon Robel",
                    "image": "https://loremflickr.com/150/150/human/?random=44.744889667154794",
                    "introduction": "sit",
                    "teachingStyle": "Mollitia et quia id doloremque aut consequuntur et sit dolores. Provident sed et alias soluta suscipit mollitia sit quo. Quis et asperiores. Velit sapiente enim.\n \rQuas amet est beatae distinctio magnam vel veritatis praesentium in. Sed numquam cupiditate vero quod exercitationem expedita. Est illo perferendis qui quidem vel.\n \rCulpa et suscipit est et doloremque rerum. Sed consequatur sed. Exercitationem necessitatibus temporibus. Provident beatae voluptates minus ut molestiae.",
                    "duringTime": "30",
                    "location": "834 Dooley Run",
                    "appointment": [
                        1,
                        3,
                        5
                    ],
                    "userId": 37,
                    "createdAt": "2024-06-06T08:14:28.000Z",
                    "updatedAt": "2024-06-06T08:14:28.000Z"
                }
            },
            {
                "id": 326,
                "startTime": "2024-06-07 19:00",
                "duringTime": "30",
                "userId": 43,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z",
                "Trainer": {
                    "id": 24,
                    "name": "Jonathon Robel",
                    "image": "https://loremflickr.com/150/150/human/?random=44.744889667154794",
                    "introduction": "sit",
                    "teachingStyle": "Mollitia et quia id doloremque aut consequuntur et sit dolores. Provident sed et alias soluta suscipit mollitia sit quo. Quis et asperiores. Velit sapiente enim.\n \rQuas amet est beatae distinctio magnam vel veritatis praesentium in. Sed numquam cupiditate vero quod exercitationem expedita. Est illo perferendis qui quidem vel.\n \rCulpa et suscipit est et doloremque rerum. Sed consequatur sed. Exercitationem necessitatibus temporibus. Provident beatae voluptates minus ut molestiae.",
                    "duringTime": "30",
                    "location": "834 Dooley Run",
                    "appointment": [
                        1,
                        3,
                        5
                    ],
                    "userId": 37,
                    "createdAt": "2024-06-06T08:14:28.000Z",
                    "updatedAt": "2024-06-06T08:14:28.000Z"
                }
            },
            {
                "id": 327,
                "startTime": "2024-06-07 19:30",
                "duringTime": "30",
                "userId": 45,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z",
                "Trainer": {
                    "id": 24,
                    "name": "Jonathon Robel",
                    "image": "https://loremflickr.com/150/150/human/?random=44.744889667154794",
                    "introduction": "sit",
                    "teachingStyle": "Mollitia et quia id doloremque aut consequuntur et sit dolores. Provident sed et alias soluta suscipit mollitia sit quo. Quis et asperiores. Velit sapiente enim.\n \rQuas amet est beatae distinctio magnam vel veritatis praesentium in. Sed numquam cupiditate vero quod exercitationem expedita. Est illo perferendis qui quidem vel.\n \rCulpa et suscipit est et doloremque rerum. Sed consequatur sed. Exercitationem necessitatibus temporibus. Provident beatae voluptates minus ut molestiae.",
                    "duringTime": "30",
                    "location": "834 Dooley Run",
                    "appointment": [
                        1,
                        3,
                        5
                    ],
                    "userId": 37,
                    "createdAt": "2024-06-06T08:14:28.000Z",
                    "updatedAt": "2024-06-06T08:14:28.000Z"
                }
            }
        ],
        "allComments": [
            {
                "id": 50,
                "scores": 4,
                "text": "Adipisci cum in veritatis dolorem voluptatem doloremque et nulla. Sed et est natus reiciendis voluptas quis. Architecto et impedit error quaerat quis voluptas eligendi libero. Nemo nobis tempora officiis est non sint voluptatem ut. Dolores nisi ab quod nihil.",
                "userId": 40,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            },
            {
                "id": 49,
                "scores": 2,
                "text": "voluptate magnam sunt",
                "userId": 62,
                "trainerId": 24,
                "createdAt": "2024-06-06T08:14:28.000Z",
                "updatedAt": "2024-06-06T08:14:28.000Z"
            }
        ],
        "avgCommentScore": {
            "avgScores": "3.0"
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
# Record

## POST /api/records (User make an appointment)  
User make an appointment  
  
(authentication is required)  
### Request Body<!-- omit in toc -->  
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
### Response<!-- omit in toc --> 
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
## DELETE /api/records/:recordId (User cancel appointment)  
User can cancel the appointment  
  
(authentication is required)
### Path Variables<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| recordId | Required | int | record id |
### Response<!-- omit in toc --> 
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

# Comment
  
## POST /api/comments (Comment)  
User can score and leave a comment about the trainer 
  
(authentication is required)
### Request Body<!-- omit in toc -->  
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
### Response<!-- omit in toc --> 
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

# Lesson  
  
## GET /api/lessons (User home page)
User get home page (index page) including:
- listed all trainer info  
- top 10 users lesson time ranking  
  
(authentication is required)
### Query Parameters<!-- omit in toc -->
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| page |  | int | index page (default: 1) |
| limit |  | int | number of trainer to show in home page (default: 8) |
### Response<!-- omit in toc -->
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "trainers": [
            {
                "id": 48,
                "name": "Ashley Hyatt",
                "image": "https://loremflickr.com/150/150/human/?random=44.205168345610105",
                "introduction": "Non sit qui mollitia repellat.\nAliquid quae vitae ...",
                "teachingStyle": "Autem quis et et ducimus. Necessitatibus quidem in...",
                "duringTime": "30",
                "location": "77130 Jenkins Field",
                "appointment": [
                    1,
                    3,
                    5,
                    0
                ],
                "userId": 72,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            },
            {
                "id": 49,
                "name": "Doug Collins",
                "image": "https://loremflickr.com/150/150/human/?random=66.84208334617314",
                "introduction": "Maiores id ut quisquam....",
                "teachingStyle": "Molestiae neque ex alias et explicabo perferendis ...",
                "duringTime": "60",
                "location": "41166 Cassin Pike",
                "appointment": [
                    1,
                    3,
                    5,
                    0
                ],
                "userId": 73,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            },
            {
                "id": 50,
                "name": "Ronnie Hoeger",
                "image": "https://loremflickr.com/150/150/human/?random=19.818182384283723",
                "introduction": "Harum sequi aut. Dolor eum quas expedita culpa qui...",
                "teachingStyle": "impedit...",
                "duringTime": "60",
                "location": "3332 Travon Square",
                "appointment": [
                    1,
                    3,
                    5,
                    0
                ],
                "userId": 74,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            },
            {
                "id": 51,
                "name": "Francis McClure",
                "image": "https://loremflickr.com/150/150/human/?random=51.11361330940127",
                "introduction": "Maiores sit nisi ipsum voluptatem enim esse autem....",
                "teachingStyle": "Laudantium eaque omnis fuga et dolores....",
                "duringTime": "30",
                "location": "14575 Carroll Locks",
                "appointment": [
                    1,
                    6,
                    0
                ],
                "userId": 75,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            }
        ],
        "userRecordRank": [
            {
                "user_id": 91,
                "totalTime": 450,
                "User.name": "Herbert Paucek",
                "User.image": "https://loremflickr.com/150/150/human/?random=42.24132897776267",
                "rankIndex": 1
            },
            {
                "user_id": 87,
                "totalTime": 390,
                "User.name": "Oscar Kiehn",
                "User.image": "https://loremflickr.com/150/150/human/?random=40.93412952822506",
                "rankIndex": 2
            },
            {
                "user_id": 96,
                "totalTime": 360,
                "User.name": "Annie Borer",
                "User.image": "https://loremflickr.com/150/150/human/?random=11.673722149008192",
                "rankIndex": 3
            },
            {
                "user_id": 74,
                "totalTime": 330,
                "User.name": "Kate Homenick",
                "User.image": "https://loremflickr.com/150/150/human/?random=42.11431855613383",
                "rankIndex": 4
            },
            {
                "user_id": 69,
                "totalTime": 330,
                "User.name": "Leticia Leuschke",
                "User.image": "https://loremflickr.com/150/150/human/?random=24.865555798947003",
                "rankIndex": 5
            },
            {
                "user_id": 86,
                "totalTime": 330,
                "User.name": "Stella Pagac",
                "User.image": "https://loremflickr.com/150/150/human/?random=91.70938209055271",
                "rankIndex": 6
            },
            {
                "user_id": 85,
                "totalTime": 300,
                "User.name": "Kerry Hettinger",
                "User.image": "https://loremflickr.com/150/150/human/?random=15.67003437424308",
                "rankIndex": 7
            },
            {
                "user_id": 76,
                "totalTime": 270,
                "User.name": "Ana Kessler",
                "User.image": "https://loremflickr.com/150/150/human/?random=23.5005319068069",
                "rankIndex": 8
            },
            {
                "user_id": 84,
                "totalTime": 270,
                "User.name": "Stephanie Upton",
                "User.image": "https://loremflickr.com/150/150/human/?random=32.33721940154442",
                "rankIndex": 9
            },
            {
                "user_id": 68,
                "totalTime": 270,
                "User.name": "user1",
                "User.image": "https://loremflickr.com/150/150/human/?random=62.735298765380335",
                "rankIndex": 10
            }
        ],
        "pagination": {
            "pages": [
                1,
                2,
                3,
                4,
                5
            ],
            "totalPage": 5,
            "currentPage": 2,
            "prev": 1,
            "next": 3
        }
    }
}
```
## GET /api/lessons/:trainerId (User gets available lesson and trainer info)
User can get the trainer information including:
- trainer info
- available reservation time
- top and lowest rated comments
- average comment score  
  
(authentication is required)
### Path Variables<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| trainerId | Required | int | trainer id |
### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "trainer": {
            "id": 44,
            "name": "Faith Lebsack",
            "image": "https://loremflickr.com/150/150/human/?random=57.45773391794711",
            "introduction": "Placeat omnis distinctio sed eos laboriosam. Voluptatum officia maiores qui. At officia est sint vitae eveniet ut. Et eum eligendi dolore velit a dolor excepturi quasi. Occaecati natus ad reprehenderit est dolores temporibus porro quia. Sint eos temporibus nemo.",
            "teachingStyle": "Eveniet ex consectetur rerum qui.",
            "duringTime": "30",
            "location": "45384 Brigitte Street",
            "appointment": [
                3,
                4,
                5
            ],
            "userId": 68,
            "createdAt": "2024-06-08T06:13:13.000Z",
            "updatedAt": "2024-06-08T06:13:13.000Z",
            "availableReserveTime": [
                "2024-06-12 18:00",
                "2024-06-12 20:00",
                "2024-06-12 20:30",
                "2024-06-12 21:00",
                "2024-06-13 18:00",
                "2024-06-13 18:30",
                "2024-06-13 19:00",
                "2024-06-13 19:30",
                "2024-06-13 20:00",
                "2024-06-13 20:30",
                "2024-06-13 21:00",
                "2024-06-14 18:00",
                "2024-06-14 18:30",
                "2024-06-14 19:00",
                "2024-06-14 19:30",
                "2024-06-14 20:00",
                "2024-06-14 20:30",
                "2024-06-14 21:00",
                "2024-06-19 18:00",
                "2024-06-19 18:30",
                "2024-06-19 19:00",
                "2024-06-19 19:30",
                "2024-06-19 20:00",
                "2024-06-19 20:30",
                "2024-06-19 21:00",
                "2024-06-20 18:00",
                "2024-06-20 18:30",
                "2024-06-20 19:00",
                "2024-06-20 19:30",
                "2024-06-20 20:00",
                "2024-06-20 20:30",
                "2024-06-20 21:00",
                "2024-06-21 18:00",
                "2024-06-21 18:30",
                "2024-06-21 19:00",
                "2024-06-21 19:30",
                "2024-06-21 20:00",
                "2024-06-21 20:30",
                "2024-06-21 21:00"
            ]
        },
        "highComment": {
            "id": 89,
            "scores": 4,
            "text": "Ut officia libero blanditiis.\nQuos recusandae veritatis accusantium qui molestias quis.\nEum dolore pariatur molestiae et eligendi assumenda tempore quaerat.\nDoloribus at eum.\nDeleniti provident quo illum amet veritatis.",
            "userId": 82,
            "trainerId": 44,
            "createdAt": "2024-06-08T06:13:13.000Z",
            "updatedAt": "2024-06-08T06:13:13.000Z"
        },
        "lowComment": {
            "id": 90,
            "scores": 3,
            "text": "Aut perferendis qui in aut eaque sint laudantium explicabo. Culpa non sit non non est. Similique dolorem et maxime quia autem illo perspiciatis itaque. Exercitationem ad quis odit voluptas. Non necessitatibus ut aut inventore et nisi architecto ut.",
            "userId": 96,
            "trainerId": 44,
            "createdAt": "2024-06-08T06:13:13.000Z",
            "updatedAt": "2024-06-08T06:13:13.000Z"
        },
        "avgCommentScore": {
            "avgScores": "3.5"
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
## GET /api/lessons/search (Search)
user can search trainer's information by keyword(search column: name, introduction, teaching style, location)
  
(authentication is required)
### Query Parameters<!-- omit in toc -->
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| keyword | Required | string | search trainer's information by keyword |
| page |  | int | index page (default: 1) |
| limit |  | int | number of trainer to show in home page (default: 8) |
### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "trainers": [
            {
                "id": 44,
                "name": "Faith Lebsack",
                "image": "https://loremflickr.com/150/150/human/?random=57.45773391794711",
                "introduction": "Placeat omnis distinctio sed eos laboriosam. Volup...",
                "teachingStyle": "Eveniet ex consectetur rerum qui....",
                "duringTime": "30",
                "location": "45384 Brigitte Street",
                "appointment": [
                    3,
                    4,
                    5
                ],
                "userId": 68,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            },
            {
                "id": 45,
                "name": "Mr. Sheri Huel",
                "image": "https://loremflickr.com/150/150/human/?random=98.67364676095328",
                "introduction": "Consectetur quibusdam illo quis incidunt voluptas ...",
                "teachingStyle": "qui...",
                "duringTime": "60",
                "location": "4524 Laney Crest",
                "appointment": [
                    3,
                    4,
                    5
                ],
                "userId": 69,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            },
            {
                "id": 49,
                "name": "Doug Collins",
                "image": "https://loremflickr.com/150/150/human/?random=66.84208334617314",
                "introduction": "Maiores id ut quisquam....",
                "teachingStyle": "Molestiae neque ex alias et explicabo perferendis ...",
                "duringTime": "60",
                "location": "41166 Cassin Pike",
                "appointment": [
                    1,
                    3,
                    5,
                    0
                ],
                "userId": 73,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            },
            {
                "id": 55,
                "name": "Ms. Max Satterfield",
                "image": "https://loremflickr.com/150/150/human/?random=46.28674774822847",
                "introduction": "Doloremque laudantium enim consectetur fuga beatae...",
                "teachingStyle": "eum...",
                "duringTime": "30",
                "location": "6735 Metz Way",
                "appointment": [
                    1,
                    3,
                    5,
                    0
                ],
                "userId": 79,
                "createdAt": "2024-06-08T06:13:13.000Z",
                "updatedAt": "2024-06-08T06:13:13.000Z"
            }
        ],
        "pagination": {
            "pages": [
                1
            ],
            "totalPage": 1,
            "currentPage": 1,
            "prev": 1,
            "next": 1
        },
        "keyword": "sec"
    }
}
```
Failure Response | code : 500
```json
{
    "status": "error",
    "message": "Error: No keyword, redirect to home page"
}
```

# Admin
  
## POST /api/admin/signin (Admin signin)  
Admin sign in.  
### Request Body<!-- omit in toc -->  
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| email | Required | string | Admin email |
| password | Required | string | Admin password |  

### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InJvb3QiLCJlbWFpbCI6InJvb3RAZXhhbXBsZS5jb20iLCJjcmVhdGVkQXQiOiIyMDI0LTA2LTEzVDA1OjQ0OjU1LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTA2LTEzVDA1OjQ0OjU1LjAwMFoiLCJpYXQiOjE3MTgyNjE0ODMsImV4cCI6MTcyMDg1MzQ4M30.g-JTM-Th4PixPtim2E98gJ9sRgv-IZ18JkXT3_Hzb4w",
        "userAdmin": {
            "id": 1,
            "name": "root",
            "email": "root@example.com",
            "createdAt": "2024-06-13T05:44:55.000Z",
            "updatedAt": "2024-06-13T05:44:55.000Z"
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
## GET /api/admin (Admin get all users)
Admin can get all users' info.  
  
(authentication is required)
### Query Parameters<!-- omit in toc -->
| Params | Required | Type | Description |
| --- | --- | --- | --- |
| page |  | int | index page (default: 1) |
| limit |  | int | number of trainer to show in home page (default: 3) |
### Response<!-- omit in toc --> 
Success | code : 200  
```json
{
    "status": "success",
    "data": {
        "users": {
            "count": 31,
            "rows": [
                {
                    "id": 68,
                    "name": "user1",
                    "email": "user1@example.com",
                    "image": "https://loremflickr.com/150/150/human/?random=62.735298765380335",
                    "introduction": "cum",
                    "isTrainer": {
                        "id": 44,
                        "name": "Faith Lebsack",
                        "image": "https://loremflickr.com/150/150/human/?random=57.45773391794711",
                        "introduction": "Placeat omnis distinctio sed eos laboriosam. Voluptatum officia maiores qui. At officia est sint vitae eveniet ut. Et eum eligendi dolore velit a dolor excepturi quasi. Occaecati natus ad reprehenderit est dolores temporibus porro quia. Sint eos temporibus nemo.",
                        "teachingStyle": "Eveniet ex consectetur rerum qui.",
                        "duringTime": "30",
                        "location": "45384 Brigitte Street",
                        "appointment": [
                            3,
                            4,
                            5
                        ],
                        "userId": 68,
                        "createdAt": "2024-06-08T06:13:13.000Z",
                        "updatedAt": "2024-06-08T06:13:13.000Z"
                    }
                },
                {
                    "id": 69,
                    "name": "Leticia Leuschke",
                    "email": "Julio_Abbott@example.net",
                    "image": "https://loremflickr.com/150/150/human/?random=24.865555798947003",
                    "introduction": "Maiores est et facilis ut vel magni aut voluptas. Adipisci voluptates qui distinctio repellat natus est delectus ullam. Placeat aliquam error sunt nostrum impedit consequatur rerum perferendis. Molestiae vel voluptatem laborum repellendus quidem. Et excepturi distinctio aliquam. Veritatis dolore deserunt qui veritatis saepe qui.",
                    "isTrainer": {
                        "id": 45,
                        "name": "Mr. Sheri Huel",
                        "image": "https://loremflickr.com/150/150/human/?random=98.67364676095328",
                        "introduction": "Consectetur quibusdam illo quis incidunt voluptas aliquid.\nEt ut hic mollitia ullam nisi.\nAutem recusandae consectetur natus quis a quibusdam rerum alias ipsa.\nEa ipsam aperiam ut voluptatem.\nSit quidem corporis culpa ea.",
                        "teachingStyle": "qui",
                        "duringTime": "60",
                        "location": "4524 Laney Crest",
                        "appointment": [
                            3,
                            4,
                            5
                        ],
                        "userId": 69,
                        "createdAt": "2024-06-08T06:13:13.000Z",
                        "updatedAt": "2024-06-08T06:13:13.000Z"
                    }
                },
                {
                    "id": 70,
                    "name": "Kelli Abshire",
                    "email": "Rod_Bayer@example.net",
                    "image": "https://loremflickr.com/150/150/human/?random=3.6518763002875376",
                    "introduction": "Reiciendis et consequatur praesentium. Distinctio ea incidunt nihil ut. Cupiditate autem est fugiat voluptate. Et quasi labore autem.\n \rEnim ipsam impedit magni voluptatibus aut autem exercitationem recusandae. Sunt tenetur amet sint ea non quibusdam illo nisi neque. Numquam minus et sit. Fuga totam est ducimus.\n \rQuae quisquam enim distinctio cum quia commodi quod. Necessitatibus aut distinctio iusto dignissimos in autem reprehenderit optio sunt. Natus asperiores rerum est asperiores distinctio voluptatem. Qui tempore et totam ex atque molestiae et. Aliquam rerum quia nemo eveniet repellendus et et.",
                    "isTrainer": {
                        "id": 46,
                        "name": "Lucia Strosin",
                        "image": "https://loremflickr.com/150/150/human/?random=46.682780142854895",
                        "introduction": "Esse placeat rerum id et veritatis quasi praesentium nihil quia.\nUllam maxime ipsam maiores odit et nam accusantium.",
                        "teachingStyle": "Delectus quaerat non neque perspiciatis voluptas. Culpa ut maxime. At unde quaerat nemo et facilis tempora iste. Mollitia autem dolores porro et facilis in impedit nam unde.",
                        "duringTime": "30",
                        "location": "946 Steuber Terrace",
                        "appointment": [
                            1,
                            3,
                            5,
                            0
                        ],
                        "userId": 70,
                        "createdAt": "2024-06-08T06:13:13.000Z",
                        "updatedAt": "2024-06-08T06:13:13.000Z"
                    }
                }
            ]
        },
        "pagination": {
            "pages": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11
            ],
            "totalPage": 11,
            "currentPage": 1,
            "prev": 1,
            "next": 2
        }
    }
}
```