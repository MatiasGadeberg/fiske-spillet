import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsP from "aws-cdk-lib/aws-ecs-patterns";
import path = require("path");

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // The code that defines your stack goes here
        const cluster = new ecs.Cluster(this, "fiskespil-cluster", {
            clusterName: "Fiskespillet",
        });

        const taskDefinition = new ecs.FargateTaskDefinition(this, "fiskespil-taks-definition");

        const backendImage = new ecs.AssetImage(path.join(__dirname, "../.."), {
            file: "backend/Dockerfile.prod",
            assetName: "fiskespil/backend",
            exclude: ["infrastructure"],
        });

        taskDefinition.addContainer("backend", {
            image: backendImage,
            containerName: "fiskespil-backend",
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: "fiskespil-backend",
                mode: ecs.AwsLogDriverMode.NON_BLOCKING,
                maxBufferSize: cdk.Size.mebibytes(25),
            }),
        });

        new ecs.FargateService(this, "fiskespil-service", {
            cluster,
            taskDefinition,
        });
    }
}
