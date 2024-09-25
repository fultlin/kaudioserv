import { env } from "process"

const EasyYandexS3 = require('easy-yandex-s3').default 

export default new EasyYandexS3({
    auth: {
        accessKeyId: env.ACCESSKEYID,
        secretAccessKey: env.SECRETACCESSKEY,
    }, 
    Bucket: 'id-kaudio',
    debug: true
})

 