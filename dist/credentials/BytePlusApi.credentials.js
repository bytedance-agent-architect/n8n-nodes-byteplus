"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BytePlusApi = void 0;
class BytePlusApi {
    constructor() {
        this.name = 'bytePlusApi';
        this.displayName = 'BytePlus API';
        this.documentationUrl = 'https://www.byteplus.com/en/docs';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'Your BytePlus ARK API Key',
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '={{"Bearer " + $credentials.apiKey}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/v3/models',
                method: 'GET',
            },
        };
    }
}
exports.BytePlusApi = BytePlusApi;
//# sourceMappingURL=BytePlusApi.credentials.js.map