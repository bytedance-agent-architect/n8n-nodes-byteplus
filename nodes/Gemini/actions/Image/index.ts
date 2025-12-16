import type { INodeProperties } from 'n8n-workflow';
import * as analyzeImage from './analyzeImage.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['image'],
			},
		},
		options: [
			{
				name: 'Analyze Image',
				value: 'analyzeImage',
				description: 'Analyze an image using Gemini Vision',
				action: 'Analyze an image',
			},
		],
		default: 'analyzeImage',
	},
	...analyzeImage.description,
];

export { analyzeImage };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'analyzeImage') {
		return await analyzeImage.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
