import type {
	IExecuteFunctions,
	INodeProperties,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

export const description: INodeProperties[] = [
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['analyzeImage'],
			},
		},
		description: 'URL of the image to analyze (must be publicly accessible)',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: 'Describe this image in detail.',
		required: true,
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['analyzeImage'],
			},
		},
		description: 'Question or instruction about the image',
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
				resource: ['image'],
				operation: ['analyzeImage'],
			},
		},
		description: 'The Gemini model to use (must support vision)',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['analyzeImage'],
			},
		},
		options: [
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberStepSize: 0.1,
				},
				default: 0.4,
				description: 'Controls randomness (lower = more focused)',
			},
			{
				displayName: 'Max Output Tokens',
				name: 'maxOutputTokens',
				type: 'number',
				default: 2048,
				description: 'Maximum number of tokens in the response',
			},
		],
	},
];

async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
	const response = await fetch(url);
	const contentType = response.headers.get('content-type') || 'image/jpeg';
	const arrayBuffer = await response.arrayBuffer();
	const base64 = Buffer.from(arrayBuffer).toString('base64');
	return { base64, mimeType: contentType };
}

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('geminiApi');
	const imageUrl = this.getNodeParameter('imageUrl', index) as string;
	const prompt = this.getNodeParameter('prompt', index) as string;
	const model = this.getNodeParameter('model', index) as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', index, {}) as IDataObject;

	const baseUrl = credentials.baseUrl as string;
	const apiKey = credentials.apiKey as string;

	// Fetch image and convert to base64
	const { base64, mimeType } = await fetchImageAsBase64(imageUrl);

	// Build request body with image and text
	const body: IDataObject = {
		contents: [
			{
				parts: [
					{
						inlineData: {
							mimeType,
							data: base64,
						},
					},
					{ text: prompt },
				],
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
	if (Object.keys(generationConfig).length > 0) {
		body.generationConfig = generationConfig;
	}

	const options = {
		method: 'POST' as IHttpRequestMethods,
		url: `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`,
		body,
		json: true,
	};

	const response = await this.helpers.request(options);

	// Extract the text from the response
	const analysis =
		response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

	return {
		success: true,
		imageUrl,
		prompt,
		model,
		analysis,
		finishReason: response?.candidates?.[0]?.finishReason || null,
		usage: response?.usageMetadata || null,
		rawResponse: response,
	};
}
