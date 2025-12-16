import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GeminiApi implements ICredentialType {
	name = 'geminiApi';
	displayName = 'Gemini API';
	documentationUrl = 'https://ai.google.dev/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Google AI API Key from Google AI Studio',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://generativelanguage.googleapis.com',
			required: true,
			description: 'Google Generative AI API Base URL',
		},
		{
			displayName: 'Default Model',
			name: 'defaultModel',
			type: 'options',
			options: [
				{ name: 'Gemini 2.0 Flash (Latest)', value: 'gemini-2.0-flash' },
				{ name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash-latest' },
				{ name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro-latest' },
			],
			default: 'gemini-2.0-flash',
			description: 'Default model to use for requests',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				key: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1beta/models',
			method: 'GET',
			qs: {
				key: '={{$credentials.apiKey}}',
			},
		},
	};
}
