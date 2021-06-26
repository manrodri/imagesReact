import {CfnOutput, Construct, RemovalPolicy, Stack, StackProps} from "@aws-cdk/core"
import * as codebuild from '@aws-cdk/aws-codebuild';
import {BuildSpec} from '@aws-cdk/aws-codebuild';
import * as iam from "@aws-cdk/aws-iam"
import * as s3 from "@aws-cdk/aws-s3"

export class InfraStack extends Stack {
    bucketUrl: CfnOutput;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // github source
        const gitHubSource = codebuild.Source.gitHub({
            owner: 'manrodri',
            repo: 'imagesReact',
            webhook: true,
            webhookFilters: [
                codebuild.FilterGroup
                    .inEventOf(codebuild.EventAction.PUSH)
                    .andBranchIs('master')]

        });

        const frontendBucket = new s3.Bucket(this, 'imagesReactBucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            websiteIndexDocument: 'index.html',
            publicReadAccess: true
        })

        const buildProject = new codebuild.Project(this, 'imagesReactCBJob', {
            source: gitHubSource,
            buildSpec: BuildSpec.fromSourceFilename("infra/buildspec.yaml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
                environmentVariables: {
                    HOSTING_BUCKET: {
                        value: frontendBucket.bucketName,
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT
                    }
                }
            }
        });

        buildProject.role?.addToPolicy(new iam.PolicyStatement({
            actions: ["s3:*"],
            resources: [frontendBucket.bucketArn, `${frontendBucket.bucketArn}/*`]
        }))

        this.bucketUrl = new CfnOutput(this, 'bucketUrl', {value: frontendBucket.bucketWebsiteUrl})

    }
}