import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BytePlusApi implements ICredentialType {
	name = 'bytePlusApi';
	displayName = 'BytePlus API';
	documentationUrl = 'https://docs.byteplus.com/en/docs';
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
			description: 'Your BytePlus ModelArk API Key',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://ark.ap-southeast.bytepluses.com',
			required: true,
			description: 'BytePlus API Base URL',
		},
		{
			displayName: 'Image Generation Endpoint',
			name: 'imageEndpoint',
			type: 'string',
			default: '/api/v3/images/generations',
			description: 'Endpoint for Seedream image generation',
		},
		{
			displayName: 'Video Generation Endpoint',
			name: 'videoEndpoint',
			type: 'string',
			default: '/api/v3/contents/generations/tasks',
			description: 'Endpoint for Seedance video generation',
		},
		{
			displayName: 'Chat Completions Endpoint',
			name: 'chatEndpoint',
			type: 'string',
			default: '/api/v3/chat/completions',
			description: 'Endpoint for Seed chat/text completions',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v3/models',
			method: 'GET',
		},
	};
}
