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
			baseURL: 'https://ark.ap-southeast.bytepluses.com',
			url: '/api/v3/models',
			method: 'GET',
		},
	};
}
