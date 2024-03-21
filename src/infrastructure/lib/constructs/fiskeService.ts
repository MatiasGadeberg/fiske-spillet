import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as cdk from "aws-cdk-lib";
import path = require("path");

export type FiskeServiceProps = {
    cluster: ecs.Cluster;
    infrastructureElemet: "frontend" | "backend" | "fish-processor" |  "boat-processor";
    dockerFileRelativePath: string;
    portMappings: ecs.PortMapping[];
    taskCpu: number;
    taskMemory: number;
};

export class FiskeService extends Construct {
    public service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: FiskeServiceProps) {
        super(scope, id);

        const infraElement = props.infrastructureElemet;

        const taskDefinition = new ecs.FargateTaskDefinition(this, `fiskespil-${infraElement}-taks-definition`, {
            cpu: props.taskCpu,
            memoryLimitMiB: props.taskMemory
        });

        const Image = new ecs.AssetImage(path.join(__dirname, "../../.."), {
            file: `${props.dockerFileRelativePath}/Dockerfile.prod`,
            assetName: `fiskespil/${infraElement}`,
            exclude: ["infrastructure"],
        });

        taskDefinition.addContainer(`${infraElement}`, {
            image: Image,
            containerName: `fiskespil-${infraElement}`,
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: `fiskespil-${infraElement}`,
                mode: ecs.AwsLogDriverMode.NON_BLOCKING,
                maxBufferSize: cdk.Size.mebibytes(25),
            }),
            portMappings: props.portMappings,
        });

        this.service = new ecs.FargateService(this, `fiskespil-${infraElement}-service`, {
            cluster: props.cluster,
            taskDefinition,
        });
    }
}
