import type { INodeProperties } from 'n8n-workflow';
import * as generateImage from './generateImage.operation';

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
				name: 'Generate Image',
				value: 'generateImage',
				description: 'Generate an image from a text prompt using Seedream',
				action: 'Generate an image',
			},
		],
		default: 'generateImage',
	},
	...generateImage.description,
];

export { generateImage };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'generateImage') {
		return await generateImage.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
