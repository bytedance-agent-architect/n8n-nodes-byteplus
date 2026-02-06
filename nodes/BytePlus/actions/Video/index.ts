import type { INodeProperties } from 'n8n-workflow';
import * as generateVideo from './generateVideo.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		options: [
			{
				name: 'Generate Video',
				value: 'generateVideo',
				description: 'Generate a video from text and reference image using Seedance',
				action: 'Generate a video',
			},
		],
		default: 'generateVideo',
	},
	...generateVideo.description,
];

export { generateVideo };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'generateVideo') {
		return await generateVideo.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
