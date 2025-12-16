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
                resource: ['image'],
                operation: ['generateImage'],
            },
        },
        description: 'Text description of the image to generate',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Seedream 4.0 (Default)', value: 'seedream-4-0-250828' },
            { name: 'Seedream 3.0', value: 'seedream-3-0' },
            { name: 'Custom (Enter Below)', value: 'custom' },
        ],
        default: 'seedream-4-0-250828',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['generateImage'],
            },
        },
        description: 'Model to use for image generation',
    },
    {
        displayName: 'Custom Model ID',
        name: 'customModel',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['image'],
                operation: ['generateImage'],
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
                resource: ['image'],
                operation: ['generateImage'],
            },
        },
        options: [
            {
                displayName: 'Size',
                name: 'size',
                type: 'options',
                options: [
                    { name: '2K (2048x2048)', value: '2K' },
                    { name: '1080p (1920x1080)', value: '1080p' },
                    { name: '720p (1280x720)', value: '720p' },
                    { name: 'Square (1024x1024)', value: '1024x1024' },
                ],
                default: '2K',
                description: 'Size of the generated image',
            },
            {
                displayName: 'Watermark',
                name: 'watermark',
                type: 'boolean',
                default: true,
                description: 'Whether to add a watermark to the generated image',
            },
            {
                displayName: 'Response Format',
                name: 'responseFormat',
                type: 'options',
                options: [
                    { name: 'URL', value: 'url' },
                    { name: 'Base64', value: 'b64_json' },
                ],
                default: 'url',
                description: 'Format of the returned image',
            },
        ],
    },
];
async function execute(index) {
    var _a, _b;
    const credentials = await this.getCredentials('bytePlusApi');
    const prompt = this.getNodeParameter('prompt', index);
    const modelSelection = this.getNodeParameter('model', index);
    const customModel = this.getNodeParameter('customModel', index, '');
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    // Resolve model: use custom if selected, otherwise use dropdown value
    const model = modelSelection === 'custom' ? customModel : modelSelection;
    const baseUrl = credentials.baseUrl;
    const imageEndpoint = credentials.imageEndpoint;
    const body = {
        model,
        prompt,
        response_format: additionalOptions.responseFormat || 'url',
        size: additionalOptions.size || '2K',
        stream: false,
        watermark: additionalOptions.watermark !== false,
    };
    const options = {
        method: 'POST',
        url: `${baseUrl}${imageEndpoint}`,
        body,
        json: true,
    };
    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'bytePlusApi', options);
    // Extract the image URL from the response
    const imageUrl = ((_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) || (response === null || response === void 0 ? void 0 : response.url) || null;
    // Download the image as binary data so it can be displayed in n8n
    let binaryData = {};
    if (imageUrl) {
        try {
            const imageResponse = await this.helpers.request({
                method: 'GET',
                url: imageUrl,
                encoding: null, // Returns Buffer
                resolveWithFullResponse: true,
            });
            const contentType = imageResponse.headers['content-type'] || 'image/png';
            const fileName = `generated-image-${Date.now()}.${contentType.split('/')[1] || 'png'}`;
            binaryData = {
                data: await this.helpers.prepareBinaryData(imageResponse.body, fileName, contentType),
            };
        }
        catch (error) {
            // If download fails, continue without binary data
            console.error('Failed to download image:', error);
        }
    }
    return {
        json: {
            success: true,
            prompt,
            imageUrl,
            rawResponse: response,
        },
        binary: binaryData,
    };
}
//# sourceMappingURL=generateImage.operation.js.map