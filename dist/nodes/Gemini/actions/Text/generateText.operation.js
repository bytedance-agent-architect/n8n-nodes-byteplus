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
                operation: ['generateText'],
            },
        },
        description: 'The prompt to send to Gemini',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Gemini 2.0 Flash (Latest)', value: 'gemini-2.0-flash' },
            { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash-latest' },
            { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro-latest' },
        ],
        default: 'gemini-2.0-flash',
        displayOptions: {
            show: {
                resource: ['text'],
                operation: ['generateText'],
            },
        },
        description: 'The Gemini model to use',
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
                operation: ['generateText'],
            },
        },
        options: [
            {
                displayName: 'System Instruction',
                name: 'systemInstruction',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: '',
                description: 'System instruction to guide the model behavior',
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
                default: 1.0,
                description: 'Controls randomness (0 = deterministic, 2 = very random)',
            },
            {
                displayName: 'Max Output Tokens',
                name: 'maxOutputTokens',
                type: 'number',
                default: 1024,
                description: 'Maximum number of tokens in the response',
            },
            {
                displayName: 'Top P',
                name: 'topP',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 1,
                    numberStepSize: 0.05,
                },
                default: 0.95,
                description: 'Nucleus sampling parameter',
            },
            {
                displayName: 'Top K',
                name: 'topK',
                type: 'number',
                default: 40,
                description: 'Top-K sampling parameter',
            },
        ],
    },
];
async function execute(index) {
    var _a, _b, _c, _d, _e, _f, _g;
    const credentials = await this.getCredentials('geminiApi');
    const prompt = this.getNodeParameter('prompt', index);
    const model = this.getNodeParameter('model', index);
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    const baseUrl = credentials.baseUrl;
    const apiKey = credentials.apiKey;
    // Build request body
    const body = {
        contents: [
            {
                parts: [{ text: prompt }],
            },
        ],
    };
    // Add generation config if any options are set
    const generationConfig = {};
    if (additionalOptions.temperature !== undefined) {
        generationConfig.temperature = additionalOptions.temperature;
    }
    if (additionalOptions.maxOutputTokens) {
        generationConfig.maxOutputTokens = additionalOptions.maxOutputTokens;
    }
    if (additionalOptions.topP !== undefined) {
        generationConfig.topP = additionalOptions.topP;
    }
    if (additionalOptions.topK !== undefined) {
        generationConfig.topK = additionalOptions.topK;
    }
    if (Object.keys(generationConfig).length > 0) {
        body.generationConfig = generationConfig;
    }
    // Add system instruction if provided
    if (additionalOptions.systemInstruction) {
        body.systemInstruction = {
            parts: [{ text: additionalOptions.systemInstruction }],
        };
    }
    const options = {
        method: 'POST',
        url: `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`,
        body,
        json: true,
    };
    const response = await this.helpers.request(options);
    // Extract the text from the response
    const generatedText = ((_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || null;
    return {
        success: true,
        prompt,
        model,
        generatedText,
        finishReason: ((_g = (_f = response === null || response === void 0 ? void 0 : response.candidates) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.finishReason) || null,
        usage: (response === null || response === void 0 ? void 0 : response.usageMetadata) || null,
        rawResponse: response,
    };
}
//# sourceMappingURL=generateText.operation.js.map