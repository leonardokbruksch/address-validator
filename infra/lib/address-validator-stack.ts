import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class AddressValidatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webBucket = new s3.Bucket(this, 'WebBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'WebOAI',
    );
    webBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(this, 'WebDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(webBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
      ],
    });

    new s3deploy.BucketDeployment(this, 'WebDeployment', {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, '../../apps/web/dist'),
        ),
      ],
      destinationBucket: webBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'WebBucketName', {
      value: webBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'WebDistributionDomainName', {
      value: distribution.domainName,
    });

    const apiFunction = new lambdaNodejs.NodejsFunction(
      this,
      'AddressValidatorApi',
      {
        entry: path.join(__dirname, '../../apps/api/src/lambda.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(30),
        bundling: {
          externalModules: [
            'aws-sdk',
            'class-transformer',
            'class-validator',
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
          ],
          format: lambdaNodejs.OutputFormat.ESM,
          tsconfig: path.join(__dirname, '../../apps/api/tsconfig.json'),
        },
        depsLockFilePath: path.join(__dirname, '../../pnpm-lock.yaml'),
        projectRoot: path.join(__dirname, '../..'),
      },
    );

    const api = new apigateway.LambdaRestApi(
      this,
      'AddressValidatorApiGateway',
      {
        handler: apiFunction,
        proxy: true,
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowMethods: apigateway.Cors.ALL_METHODS,
          allowHeaders: ['Content-Type', 'Authorization'],
        },
      },
    );

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
    });
  }
}
