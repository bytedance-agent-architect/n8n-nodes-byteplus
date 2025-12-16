import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as text from './actions/Text';
import * as image from './actions/Image';

export class Gemini implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gemini',
		name: 'gemini',
		icon: 'file:gemini.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Google Gemini AI - Text Generation, Image Analysis',
		defaults: {
			name: 'Gemini',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'geminiApi',
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
						description: 'Generate text using Gemini',
					},
					{
						name: 'Image',
						value: 'image',
						description: 'Analyze images using Gemini Vision',
					},
				],
				default: 'text',
			},
			// Text operations
			...text.description,
			// Image operations
			...image.description,
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
				} else if (resource === 'image') {
					responseData = await image.execute.call(this, i, operation);
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
