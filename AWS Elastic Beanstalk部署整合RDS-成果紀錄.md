# AWS Elastic Beanstalk部署整合RDS-成果紀錄<!-- omit in toc -->  
- 將此Node.js後端API server部署至AWS Elastic Beanstalk，並整合RDS資料庫；使用Postman驗證部署成果(RDS資料庫CRUD、種子資料載入)。  
  
- {{AWS_url}}: http://workout-booking-app-backend-dev.ap-northeast-1.elasticbeanstalk.com (已停用)  
  
- AWS閱讀學習筆記-經典架構: https://medium.com/@vicky160671014/%E9%96%B1%E8%AE%80%E7%AD%86%E8%A8%98%E6%95%B4%E7%90%86-aws%E5%AD%B8%E7%BF%92%E7%AD%86%E8%A8%98-%E7%B6%93%E5%85%B8%E6%9E%B6%E6%A7%8B-776167b7da70
  
## Table of contents<!-- omit in toc -->
- [1. POST /api/signin (User signin)](#1-post-apisignin-user-signin)
- [2. GET /api/lessons (User home page)](#2-get-apilessons-user-home-page)
- [3. POST /api/records (User make an appointment)](#3-post-apirecords-user-make-an-appointment)
- [4. PUT /api/trainers/:trainerId (Modify trainer information)](#4-put-apitrainerstrainerid-modify-trainer-information)
- [5. DELETE /api/records/:recordId (User cancel appointment)](#5-delete-apirecordsrecordid-user-cancel-appointment)
- [Postman驗證清單](#postman驗證清單)
- [AWS Dashboard 資訊](#aws-dashboard-資訊)

  
## 1. POST /api/signin (User signin)  
- 成功取得登入token及使用者資訊  

<div align="center">
<img width="100%" alt="deploy-POST-signin" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-POST-signin.jpg"/>
</div>
  
<div align="center">
<img width="100%" alt="deploy-POST-signin-log" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-POST-signin-log.jpg"/>
</div>
  
## 2. GET /api/lessons (User home page)  
- 使用token取得使用者首頁資料
  
<div align="center">
<img width="100%" alt="deploy-GET-lessons" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-GET-lessons.jpg"/>
</div>
  
<div align="center">
<img width="100%" alt="deploy-GET-lessons-log" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-GET-lessons-log.jpg"/>
</div>
  
## 3. POST /api/records (User make an appointment)  
- 成功預約課程  
  
<div align="center">
<img width="100%" alt="deploy-POST-record" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-POST-record.jpg"/>
</div>
  
- 預約不符合教練開課時間，回報錯誤  
  
<div align="center">
<img width="100%" alt="deploy-POST-record-error-1" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-POST-record-error-1.jpg"/>
</div>
  
- 重複預約，回報錯誤  
  
<div align="center">
<img width="100%" alt="deploy-POST-record-error-2" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-POST-record-error-2.jpg"/>
</div>
  
## 4. PUT /api/trainers/:trainerId (Modify trainer information)  
- 修改教練個人開課資訊  
  
<div align="center">
<img width="100%" alt="deploy-PUT-trainer" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-PUT-trainer.jpg"/>
</div>
  
## 5. DELETE /api/records/:recordId (User cancel appointment)  
- 取消課程預約  
  
<div align="center">
<img width="100%" alt="deploy-DELETE-record" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-DELETE-record.jpg"/>
</div>
  
## Postman驗證清單  
  
<div align="center">
<img width="100%" alt="deploy-all-postman-list" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/deploy-all-postman-list.jpg"/>
</div>
  
## AWS Dashboard 資訊  
- Elastic Beanstalk  

<div align="center">
<img width="100%" alt="AWS-EB" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/AWS-EB.jpg"/>
</div>

- 應用程式運行之EC2虛擬主機  

<div align="center">
<img width="100%" alt="AWS-EC2" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/AWS-EC2.jpg"/>
</div>

- 資料庫RDS  

<div align="center">
<img width="100%" alt="AWS-RDS" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/AWS-RDS.jpg"/>
</div>

- S3儲存槽(EB會從S3拉檔案部署)  

<div align="center">
<img width="100%" alt="AWS-S3" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/AWS-S3.jpg"/>
</div>

- 所在的VPC  

<div align="center">
<img width="100%" alt="AWS-VPC" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/AWS-VPC.jpg"/>
</div>
