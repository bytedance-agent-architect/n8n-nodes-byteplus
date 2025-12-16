import type { INodeProperties } from 'n8n-workflow';
import * as publishToTikTok from './publishToTikTok.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sharing'],
			},
		},
		options: [
			{
				name: 'Publish to TikTok',
				value: 'publishToTikTok',
				description: 'Publish a video to TikTok',
				action: 'Publish video to TikTok',
			},
		],
		default: 'publishToTikTok',
	},
	...publishToTikTok.description,
];

export { publishToTikTok };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'publishToTikTok') {
		return await publishToTikTok.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
