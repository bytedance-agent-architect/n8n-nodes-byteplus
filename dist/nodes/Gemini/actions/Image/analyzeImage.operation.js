"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
exports.description = [
    {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['analyzeImage'],
            },
        },
        description: 'URL of the image to analyze (must be publicly accessible)',
    },
    {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: 'Describe this image in detail.',
        required: true,
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['analyzeImage'],
            },
        },
        description: 'Question or instruction about the image',
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
                resource: ['image'],
                operation: ['analyzeImage'],
            },
        },
        description: 'The Gemini model to use (must support vision)',
    },
    {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['analyzeImage'],
            },
        },
        options: [
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 2,
                    numberStepSize: 0.1,
                },
                default: 0.4,
                description: 'Controls randomness (lower = more focused)',
            },
            {
                displayName: 'Max Output Tokens',
                name: 'maxOutputTokens',
                type: 'number',
                default: 2048,
                description: 'Maximum number of tokens in the response',
            },
        ],
    },
];
async function fetchImageAsBase64(url) {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { base64, mimeType: contentType };
}
async function execute(index) {
    var _a, _b, _c, _d, _e, _f, _g;
    const credentials = await this.getCredentials('geminiApi');
    const imageUrl = this.getNodeParameter('imageUrl', index);
    const prompt = this.getNodeParameter('prompt', index);
    const model = this.getNodeParameter('model', index);
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    const baseUrl = credentials.baseUrl;
    const apiKey = credentials.apiKey;
    // Fetch image and convert to base64
    const { base64, mimeType } = await fetchImageAsBase64(imageUrl);
    // Build request body with image and text
    const body = {
        contents: [
            {
                parts: [
                    {
                        inlineData: {
                            mimeType,
                            data: base64,
                        },
                    },
                    { text: prompt },
                ],
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
    if (Object.keys(generationConfig).length > 0) {
        body.generationConfig = generationConfig;
    }
    const options = {
        method: 'POST',
        url: `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`,
        body,
        json: true,
    };
    const response = await this.helpers.request(options);
    // Extract the text from the response
    const analysis = ((_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || null;
    return {
        success: true,
        imageUrl,
        prompt,
        model,
        analysis,
        finishReason: ((_g = (_f = response === null || response === void 0 ? void 0 : response.candidates) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.finishReason) || null,
        usage: (response === null || response === void 0 ? void 0 : response.usageMetadata) || null,
        rawResponse: response,
    };
}
//# sourceMappingURL=analyzeImage.operation.js.map