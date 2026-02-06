import type {
	IExecuteFunctions,
	INodeProperties,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

export const description: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{ name: 'Seed 1.6 Flash (Default)', value: 'seed-1-6-flash-250615' },
			{ name: 'Seed 1.5 Pro', value: 'seed-1-5-pro' },
			{ name: 'Custom (Enter Below)', value: 'custom' },
		],
		default: 'seed-1-6-flash-250615',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['answerQuestion'],
			},
		},
		description: 'Model to use for text generation',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['answerQuestion'],
			},
		},
		description: 'The question or prompt to send to the LLM',
	},
	{
		displayName: 'Custom Model ID',
		name: 'customModel',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['answerQuestion'],
				model: ['custom'],
			},
		},
		description: 'Enter a custom model ID',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['answerQuestion'],
			},
		},
		options: [
			{
				displayName: 'System Message',
				name: 'systemMessage',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: 'You are a helpful assistant. Be very brief and concise.',
				description: 'System message to set the behavior of the assistant',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberStepSize: 0.1,
				},
				default: 0.7,
				description: 'Controls randomness (0 = deterministic, 2 = very random)',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 1024,
				description: 'Maximum number of tokens in the response',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('bytePlusApi');
	const prompt = this.getNodeParameter('prompt', index) as string;
	const modelSelection = this.getNodeParameter('model', index) as string;
	const customModel = this.getNodeParameter('customModel', index, '') as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as IDataObject;

	// Resolve model: use custom if selected, otherwise use dropdown value
	const model = modelSelection === 'custom' ? customModel : modelSelection;

	const baseUrl = credentials.baseUrl as string;
	const chatEndpoint = credentials.chatEndpoint as string;

	const systemMessage = (additionalOptions.systemMessage as string) || 'You are a helpful assistant. Be very brief and concise.';
	const temperature = (additionalOptions.temperature as number) ?? 0.7;
	const maxTokens = (additionalOptions.maxTokens as number) || 1024;

	const messages = [
		{ role: 'system', content: systemMessage },
		{ role: 'user', content: prompt },
	];

	const body: IDataObject = {
		model,
		messages,
	};

	if (temperature !== undefined) {
		body.temperature = temperature;
	}

	if (maxTokens) {
		body.max_tokens = maxTokens;
	}

	const options = {
		method: 'POST' as IHttpRequestMethods,
		url: `${baseUrl}${chatEndpoint}`,
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'bytePlusApi',
		options,
	);

	// Extract the answer from the response
	const answer = response?.choices?.[0]?.message?.content || response?.text || response?.message || null;

	return {
		success: true,
		prompt,
		answer,
		model: response?.model || model,
		usage: response?.usage || null,
		rawResponse: response,
	};
}
