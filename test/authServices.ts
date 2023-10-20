import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: 'us-east-2',
    userPoolId: 'us-east-2_T99FSJ0CX',
    identityPool: 'us-east-2:e44e7f68-e167-4025-9a11-09f44a91346d',
    userPoolWebClientId: '40ftnssd259gcslh223aabcha',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
})


export class AuthService {
  public async login(username: string, password: string) {
    const result = await Auth.signIn(username, password) as CognitoUser
    return result
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken()
    const cognitoIdentityPool = `cognito-idp.us-east-2.amazonaws.com/us-east-2_T99FSJ0CX`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'us-east-2:e44e7f68-e167-4025-9a11-09f44a91346d',
        logins: {
          [cognitoIdentityPool]: jwtToken
        }

      })
    })
    const credential = await cognitoIdentity.config.credentials()
    return credential;
  }
}
