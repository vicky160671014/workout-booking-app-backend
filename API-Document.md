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