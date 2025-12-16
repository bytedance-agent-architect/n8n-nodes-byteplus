"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiApi = void 0;
class GeminiApi {
    constructor() {
        this.name = 'geminiApi';
        this.displayName = 'Gemini API';
        this.documentationUrl = 'https://ai.google.dev/docs';
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
        this.authenticate = {
            type: 'generic',
            properties: {
                qs: {
                    key: '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
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
}
exports.GeminiApi = GeminiApi;
//# sourceMappingURL=GeminiApi.credentials.js.map