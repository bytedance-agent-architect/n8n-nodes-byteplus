import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const REGISTRATION_URL =
	'https://console.byteplus.com/ark/region:ark+ap-southeast-1/apiKey?utm_source=SFCRM&utm_content=b2d82df4-9f02-18e6-9df7-508434916e62';

export class BytePlusApi implements ICredentialType {
	name = 'bytePlusApi';
	displayName = 'BytePlus API';
	documentationUrl = 'https://docs.byteplus.com/en/docs';
	properties: INodeProperties[] = [
		{
			displayName: `Need an API key? <a href="${REGISTRATION_URL}" target="_blank">Create one in BytePlus ARK Console</a>`,
			name: 'registrationNotice',
			type: 'notice',
			default: '',
		},
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
