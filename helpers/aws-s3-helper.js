require('dotenv').config()
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const crypto = require('crypto')

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex') // 使用crypto亂數產生字串

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretKey = process.env.SECRET_KEY

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  }
})
async function uploadUserImage (userEmail, file) {
  const imageNameTail = randomImageName()
  const key = `users/${userEmail}/${imageNameTail}`
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  }
  const command = new PutObjectCommand(params)
  await s3.send(command)
  return key
}

async function getImageFromS3 (imageName) {
  const getObjectParams = {
    Bucket: bucketName,
    Key: imageName
  }
  const command = new GetObjectCommand(getObjectParams)
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
  return url
}

async function deleteImageFromS3 (imageName) {
  const deleteObjectParams = {
    Bucket: bucketName,
    Key: imageName
  }
  const command = new DeleteObjectCommand(deleteObjectParams)
  await s3.send(command)
  return true
}

module.exports = { uploadUserImage, getImageFromS3, deleteImageFromS3 }
