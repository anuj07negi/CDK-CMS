import { AuthService } from "./authServices";
 import { S3Client, ListBucketsCommand} from '@aws-sdk/client-s3'
async function testAuth(){
  const service = new AuthService();
  const result = await service.login('ANUJNEGI', 'Abcd1234!')
  const cred = await service.generateTemporaryCredentials(result)
  return cred
}

testAuth()
