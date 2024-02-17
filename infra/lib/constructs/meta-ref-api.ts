import { Construct } from "constructs";
import { LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Function } from "aws-cdk-lib/aws-lambda";

export interface MetaRefApiProps {
    telegramHandlerLambda: Function
}

export class MetaRefApi extends Construct {
    constructor(scope: Construct, props: MetaRefApiProps) {
        super(scope, 'MetaRefApi');

        // Create an API Gateway
        const api = new RestApi(this, 'MetaRefApi', { restApiName: 'MetaRefApi' });

        // Create a resource
        const resource = new Resource(this, 'TelegramWebhookResource', {
            parent: api.root,
            pathPart: 'webhook',
        });

        // Create a Lambda integration
        const integration = new LambdaIntegration(props.telegramHandlerLambda);

        // Attach the Lambda integration to a POST method
        resource.addMethod('POST', integration);
    }
}