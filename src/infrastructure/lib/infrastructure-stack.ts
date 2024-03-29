import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { FiskeService } from "./constructs/fiskeService";

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, "fiske-vpc", {
            vpcName: "Fiskenettet",
            maxAzs: 2,
        });

        // The code that defines your stack goes here
        const cluster = new ecs.Cluster(this, "fiskespil-cluster", {
            clusterName: "Fiskespillet",
            vpc,
        });

        new FiskeService(this, "fiske-backend", {
            cluster,
            infrastructureElemet: "backend",
            dockerFileRelativePath: "backend",
            portMappings: [],
            taskCpu: 16384,
            taskMemory: 32768
        });

        new FiskeService(this, "fish-processor", {
            cluster,
            infrastructureElemet: "fish-processor",
            dockerFileRelativePath: "backend/src/fish-processor",
            portMappings: [],
            taskCpu: 16384,
            taskMemory: 32768
        });

        new FiskeService(this, "boat-processor", {
            cluster,
            infrastructureElemet: "boat-processor",
            dockerFileRelativePath: "backend/src/boat-processor",
            portMappings: [],
            taskCpu: 16384,
            taskMemory: 32768
        });

        const frontendService = new FiskeService(this, "fiske-frontend", {
            cluster,
            infrastructureElemet: "frontend",
            dockerFileRelativePath: "frontend",
            taskCpu: 1024,
            taskMemory: 2048,
            portMappings: [
                {
                    containerPort: 80,
                    hostPort: 80,
                },
            ],
        });

        const alb = new elbv2.ApplicationLoadBalancer(this, "MyALB", {
            vpc,
            internetFacing: true, // Set to false if internal facing
        });

        // Create a listener for the ALB
        const listener = alb.addListener("MyListener", {
            port: 80, // Adjust the port as needed
            open: true,
        });

        // Add the ECS service as a target to the ALB listener
        listener.addTargets("EcsTargets", {
            targets: [frontendService.service],
            healthCheck: {
                path: "/", // Adjust the path as needed
            },
            port: 80,
        });
    }
}
