import type { INodeProperties } from 'n8n-workflow';
import * as uploadVideo from './uploadVideo.operation';

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
				name: 'Upload Video',
				value: 'uploadVideo',
				description: 'Upload a video to TikTok',
				action: 'Upload video to TikTok',
			},
		],
		default: 'uploadVideo',
	},
	...uploadVideo.description,
];

export { uploadVideo };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'uploadVideo') {
		return await uploadVideo.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
