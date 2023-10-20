import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: '',
    userPoolId: '',
    identityPool: '',
    userPoolWebClientId: '',
    authenticationFlowType: ''
  }
})


export class AuthService {
  public async login(username: string, password: string) {
    const result = await Auth.signIn(username, password) as CognitoUser
    return result
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken()
    console.log(jwtToken)
    const cognitoIdentityPool = ``;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: '',
        logins: {
          [cognitoIdentityPool]: jwtToken
        }

      })
    })
    const credential = await cognitoIdentity.config.credentials()
    return credential;
  }
}
