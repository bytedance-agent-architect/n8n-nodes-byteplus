import type {
	IExecuteFunctions,
	INodeProperties,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

export const description: INodeProperties[] = [
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
				operation: ['generateText'],
			},
		},
		description: 'The prompt to send to Gemini',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		options: [
			{ name: 'Gemini 2.0 Flash (Latest)', value: 'gemini-2.0-flash' },
			{ name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash-latest' },
			{ name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro-latest' },
		],
		default: 'gemini-2.0-flash',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['generateText'],
			},
		},
		description: 'The Gemini model to use',
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
				operation: ['generateText'],
			},
		},
		options: [
			{
				displayName: 'System Instruction',
				name: 'systemInstruction',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'System instruction to guide the model behavior',
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
				default: 1.0,
				description: 'Controls randomness (0 = deterministic, 2 = very random)',
			},
			{
				displayName: 'Max Output Tokens',
				name: 'maxOutputTokens',
				type: 'number',
				default: 1024,
				description: 'Maximum number of tokens in the response',
			},
			{
				displayName: 'Top P',
				name: 'topP',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberStepSize: 0.05,
				},
				default: 0.95,
				description: 'Nucleus sampling parameter',
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				default: 40,
				description: 'Top-K sampling parameter',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('geminiApi');
	const prompt = this.getNodeParameter('prompt', index) as string;
	const model = this.getNodeParameter('model', index) as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as IDataObject;

	const baseUrl = credentials.baseUrl as string;
	const apiKey = credentials.apiKey as string;

	// Build request body
	const body: IDataObject = {
		contents: [
			{
				parts: [{ text: prompt }],
			},
		],
	};

	// Add generation config if any options are set
	const generationConfig: IDataObject = {};
	if (additionalOptions.temperature !== undefined) {
		generationConfig.temperature = additionalOptions.temperature;
	}
	if (additionalOptions.maxOutputTokens) {
		generationConfig.maxOutputTokens = additionalOptions.maxOutputTokens;
	}
	if (additionalOptions.topP !== undefined) {
		generationConfig.topP = additionalOptions.topP;
	}
	if (additionalOptions.topK !== undefined) {
		generationConfig.topK = additionalOptions.topK;
	}
	if (Object.keys(generationConfig).length > 0) {
		body.generationConfig = generationConfig;
	}

	// Add system instruction if provided
	if (additionalOptions.systemInstruction) {
		body.systemInstruction = {
			parts: [{ text: additionalOptions.systemInstruction }],
		};
	}

	const options = {
		method: 'POST' as IHttpRequestMethods,
		url: `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`,
		body,
		json: true,
	};

	const response = await this.helpers.request(options);

	// Extract the text from the response
	const generatedText =
		response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

	return {
		success: true,
		prompt,
		model,
		generatedText,
		finishReason: response?.candidates?.[0]?.finishReason || null,
		usage: response?.usageMetadata || null,
		rawResponse: response,
	};
}
