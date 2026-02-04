import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class TikTokOAuth2Api implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
}
