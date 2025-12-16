import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
import * as generateText from './generateText.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['text'],
			},
		},
		options: [
			{
				name: 'Generate Text',
				value: 'generateText',
				description: 'Generate text using AWS Bedrock',
				action: 'Generate text',
			},
		],
		default: 'generateText',
	},
	...generateText.description,
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject> {
	if (operation === 'generateText') {
		return generateText.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
