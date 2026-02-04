"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TikTokOAuth2Api = void 0;
class TikTokOAuth2Api {
    constructor() {
        this.name = 'tiktokOAuth2Api';
        this.displayName = 'TikTok API';
        this.documentationUrl = 'https://developers.tiktok.com/doc/login-kit-web';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.accessToken}}',
                    'Content-Type': 'application/json',
                },
            },
        };
    }
}
exports.TikTokOAuth2Api = TikTokOAuth2Api;
//# sourceMappingURL=TikTokOAuth2Api.credentials.js.map