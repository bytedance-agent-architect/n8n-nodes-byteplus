"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsBedrockApi = void 0;
class AwsBedrockApi {
    constructor() {
        this.name = 'awsBedrockApi';
        this.displayName = 'AWS Bedrock API';
        this.documentationUrl = 'https://docs.aws.amazon.com/bedrock/latest/userguide/';
        this.properties = [
            {
                displayName: 'Access Key ID',
                name: 'accessKeyId',
                type: 'string',
                default: '',
                required: true,
                description: 'Your AWS Access Key ID (starts with AKIA...)',
            },
            {
                displayName: 'Secret Access Key',
                name: 'secretAccessKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your AWS Secret Access Key',
            },
            {
                displayName: 'Region',
                name: 'region',
                type: 'options',
                options: [
                    { name: 'US East (N. Virginia) - us-east-1', value: 'us-east-1' },
                    { name: 'US West (Oregon) - us-west-2', value: 'us-west-2' },
                    { name: 'EU (Frankfurt) - eu-central-1', value: 'eu-central-1' },
                    { name: 'EU (Ireland) - eu-west-1', value: 'eu-west-1' },
                    { name: 'EU (Paris) - eu-west-3', value: 'eu-west-3' },
                    { name: 'Asia Pacific (Mumbai) - ap-south-1', value: 'ap-south-1' },
                    { name: 'Asia Pacific (Singapore) - ap-southeast-1', value: 'ap-southeast-1' },
                    { name: 'Asia Pacific (Sydney) - ap-southeast-2', value: 'ap-southeast-2' },
                    { name: 'Asia Pacific (Tokyo) - ap-northeast-1', value: 'ap-northeast-1' },
                ],
                default: 'us-east-1',
                required: true,
                description: 'AWS Region where Bedrock is available',
            },
        ];
    }
}
exports.AwsBedrockApi = AwsBedrockApi;
//# sourceMappingURL=AwsBedrockApi.credentials.js.map