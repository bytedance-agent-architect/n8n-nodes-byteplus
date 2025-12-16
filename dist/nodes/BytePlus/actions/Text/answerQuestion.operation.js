"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
exports.description = [
    {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['text'],
                operation: ['answerQuestion'],
            },
        },
        description: 'The question or prompt to send to the LLM',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Seed 1.6 Flash (Default)', value: 'seed-1-6-flash-250615' },
            { name: 'Seed 1.5 Pro', value: 'seed-1-5-pro' },
            { name: 'Custom (Enter Below)', value: 'custom' },
        ],
        default: 'seed-1-6-flash-250615',
        displayOptions: {
            show: {
                resource: ['text'],
                operation: ['answerQuestion'],
            },
        },
        description: 'Model to use for text generation',
    },
    {
        displayName: 'Custom Model ID',
        name: 'customModel',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['text'],
                operation: ['answerQuestion'],
                model: ['custom'],
            },
        },
        description: 'Enter a custom model ID',
    },
    {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['text'],
                operation: ['answerQuestion'],
            },
        },
        options: [
            {
                displayName: 'System Message',
                name: 'systemMessage',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: 'You are a helpful assistant. Be very brief and concise.',
                description: 'System message to set the behavior of the assistant',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 2,
                    numberStepSize: 0.1,
                },
                default: 0.7,
                description: 'Controls randomness (0 = deterministic, 2 = very random)',
            },
            {
                displayName: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                default: 1024,
                description: 'Maximum number of tokens in the response',
            },
        ],
    },
];
async function execute(index) {
    var _a, _b, _c, _d;
    const credentials = await this.getCredentials('bytePlusApi');
    const prompt = this.getNodeParameter('prompt', index);
    const modelSelection = this.getNodeParameter('model', index);
    const customModel = this.getNodeParameter('customModel', index, '');
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    // Resolve model: use custom if selected, otherwise use dropdown value
    const model = modelSelection === 'custom' ? customModel : modelSelection;
    const baseUrl = credentials.baseUrl;
    const chatEndpoint = credentials.chatEndpoint;
    const systemMessage = additionalOptions.systemMessage || 'You are a helpful assistant. Be very brief and concise.';
    const temperature = (_a = additionalOptions.temperature) !== null && _a !== void 0 ? _a : 0.7;
    const maxTokens = additionalOptions.maxTokens || 1024;
    const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
    ];
    const body = {
        model,
        messages,
    };
    if (temperature !== undefined) {
        body.temperature = temperature;
    }
    if (maxTokens) {
        body.max_tokens = maxTokens;
    }
    const options = {
        method: 'POST',
        url: `${baseUrl}${chatEndpoint}`,
        body,
        json: true,
    };
    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'bytePlusApi', options);
    // Extract the answer from the response
    const answer = ((_d = (_c = (_b = response === null || response === void 0 ? void 0 : response.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || (response === null || response === void 0 ? void 0 : response.text) || (response === null || response === void 0 ? void 0 : response.message) || null;
    return {
        success: true,
        prompt,
        answer,
        model: (response === null || response === void 0 ? void 0 : response.model) || model,
        usage: (response === null || response === void 0 ? void 0 : response.usage) || null,
        rawResponse: response,
    };
}
//# sourceMappingURL=answerQuestion.operation.js.map