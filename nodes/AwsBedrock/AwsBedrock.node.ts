import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as text from './actions/Text';

export class AwsBedrock implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AWS Bedrock',
		name: 'awsBedrock',
		icon: 'file:awsbedrock.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'AWS Bedrock AI - Text Generation with Claude, Nova, Llama, and more',
		defaults: {
			name: 'AWS Bedrock',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'awsBedrockApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Text',
						value: 'text',
						description: 'Generate text using AWS Bedrock models',
					},
				],
				default: 'text',
			},
			// Text operations
			...text.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'text') {
					responseData = await text.execute.call(this, i, operation);
				}

				if (responseData) {
					if (Array.isArray(responseData)) {
						returnData.push(...responseData);
					} else {
						returnData.push({ json: responseData });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
