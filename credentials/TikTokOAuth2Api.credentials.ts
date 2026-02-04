import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TikTokOAuth2Api implements ICredentialType {
	name = 'tiktokOAuth2Api';
	displayName = 'TikTok API';
	documentationUrl = 'https://developers.tiktok.com/doc/login-kit-web';
	properties: INodeProperties[] = [
		{
			displayName: 'Client Key',
			name: 'clientKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Your TikTok app Client Key',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your TikTok app Client Secret',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Get this from the get-tiktok-token.sh script',
		},
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Used to automatically refresh access token',
		},
		{
			displayName: 'Open ID',
			name: 'openId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your TikTok Open ID (returned from OAuth)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
				'Content-Type': 'application/json',
			},
		},
	};
}
