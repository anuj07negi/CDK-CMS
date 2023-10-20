import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
// import { getSuffixFromStack } from '../Utils';
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';


export class AuthStack extends Stack {

  public userPool: UserPool
  public userPoolClient: UserPoolClient
  public identityPool: CfnIdentityPool
  public authenticatedRole: Role
  public unAuthenticatedRole: Role
  public adminRole: Role

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createUserPool()
    this.createUserPoolClient()
    this.createIdentityPool()
    this.createRole()
    this.attachRole()
    this.createAdminsGroup()
  }

  private createUserPool() {
    this.userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true
      }
    })
    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId
    })
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('UserPoolClient', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true
      }
    });
    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId
    })
  }

  private createAdminsGroup() {
    new CfnUserPoolGroup(this, 'CMSAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admins',
      roleArn: this.adminRole.roleArn
    })
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, 'CMSIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        providerName: this.userPool.userPoolProviderName,
        clientId: this.userPoolClient.userPoolClientId
      }]
    })
    new CfnOutput(this, 'CMSIdentityPoolId', {
      value: this.identityPool.ref
    })
  }

  private createRole() {
    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        },
      }, 'sts:AssumeRoleWithWebIdentity'

      )
    })

    this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated'
        },
      }, 'sts:AssumeRoleWithWebIdentity'

      )
    })

    this.adminRole = new Role(this, 'CognitoDefaultAdmindRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated'
        },
      }, 'sts:AssumeRoleWithWebIdentity'

      )
    })

    this.adminRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['S3:ListAllMyBuckets'],
      resources: ['*']

    }))
  }

  private attachRole(){
    new CfnIdentityPoolRoleAttachment(this, 'RoleAttachment',{
      identityPoolId: this.identityPool.ref,
      roles: {
        'authenticated': this.authenticatedRole.roleArn,
        'unauthenticated': this.unAuthenticatedRole.roleArn
      },
      roleMappings:{
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
        }
      }
    })

  }
}