import type { INodeProperties } from 'n8n-workflow';
import * as answerQuestion from './answerQuestion.operation';

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
				name: 'Answer Question',
				value: 'answerQuestion',
				description: 'Get an answer to a question using Seed LLM',
				action: 'Answer a question',
			},
		],
		default: 'answerQuestion',
	},
	...answerQuestion.description,
];

export { answerQuestion };

export async function execute(
	this: import('n8n-workflow').IExecuteFunctions,
	index: number,
	operation: string,
) {
	if (operation === 'answerQuestion') {
		return await answerQuestion.execute.call(this, index);
	}
	throw new Error(`Unknown operation: ${operation}`);
}
