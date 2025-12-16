import type { INodeProperties } from 'n8n-workflow';
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
				description: 'Generate text from a prompt using Gemini',
				action: 'Generate text',
			},
		],
		default: 'generateText',
	},
	...generateText.description,
];

export { generateText };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'generateText') {
		return await generateText.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
