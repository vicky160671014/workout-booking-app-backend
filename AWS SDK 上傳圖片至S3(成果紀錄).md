# AWS SDK 上傳圖片至S3-成果紀錄 
- 使用AWS SDK for JavaScript (@aws-sdk/client-s3、@aws-sdk/s3-request-presigner)結合multer將圖片上傳至S3  
- [feat: add user image upload to S3 (commit 568bf04)](https://github.com/vicky160671014/workout-booking-app-backend/commit/568bf04cb8bf0baf641be50008b5e17d315f6b05)
- [feat: add get presigned URL for user image from S3 (commit d46e983)](https://github.com/vicky160671014/workout-booking-app-backend/commit/d46e983a70ef402fed14d8b21d05ba4c032529ea)
  
## 上傳圖片至S3  
- 將圖片上傳至S3  
  
<div align="center">
<img width="100%" alt="api_uploadToS3" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/api_uploadToS3.jpg"/>
</div>
  
- 於S3中的物件  
  
<div align="center">
<img width="100%" alt="S3object_uploadToS3" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/S3object_uploadToS3.jpg"/>
</div>
  
- 將物件的key儲存至資料庫  
  
<div align="center">
<img width="100%" alt="dbUserImage_uploadToS3" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/dbUserImage_uploadToS3.jpg"/>
</div>
  
## 取得Presigned URL回傳前端，前端再透過此Presigned URL從S3取得物件  
- 取得Presigned URL  
- Presigned URL不需要AWS帳號與登入動作，即可操作指定之S3 bucket中的物件，所以建立時會預設expire time來保護資料　　
    
<div align="center">
<img width="100%" alt="getSignedURL" src="https://github.com/vicky160671014/workout-booking-app-backend/blob/main/public/img/getSignedURL.jpg"/>
</div>
  