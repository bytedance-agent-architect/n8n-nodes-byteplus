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
                resource: ['video'],
                operation: ['generateVideo'],
            },
        },
        description: 'Text description of the video to generate',
    },
    {
        displayName: 'Reference Image URL',
        name: 'imageUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['generateVideo'],
            },
        },
        description: 'URL of the reference image (must be a public https:// URL)',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Seedance 1.0 Lite I2V (Default)', value: 'seedance-1-0-lite-i2v-250428' },
            { name: 'Seedance 1.0 I2V', value: 'seedance-1-0-i2v' },
            { name: 'Custom (Enter Below)', value: 'custom' },
        ],
        default: 'seedance-1-0-lite-i2v-250428',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['generateVideo'],
            },
        },
        description: 'Model to use for video generation',
    },
    {
        displayName: 'Custom Model ID',
        name: 'customModel',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                resource: ['video'],
                operation: ['generateVideo'],
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
                resource: ['video'],
                operation: ['generateVideo'],
            },
        },
        options: [
            {
                displayName: 'Max Wait Time (Seconds)',
                name: 'maxWaitTime',
                type: 'number',
                default: 300,
                description: 'Maximum time to wait for video generation (in seconds)',
            },
            {
                displayName: 'Poll Interval (Seconds)',
                name: 'pollInterval',
                type: 'number',
                default: 2,
                description: 'How often to check if the video is ready (in seconds)',
            },
        ],
    },
];
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function execute(index) {
    var _a, _b, _c, _d, _e, _f;
    const credentials = await this.getCredentials('bytePlusApi');
    const prompt = this.getNodeParameter('prompt', index);
    const imageUrl = this.getNodeParameter('imageUrl', index);
    const modelSelection = this.getNodeParameter('model', index);
    const customModel = this.getNodeParameter('customModel', index, '');
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    // Resolve model: use custom if selected, otherwise use dropdown value
    const model = modelSelection === 'custom' ? customModel : modelSelection;
    const maxWaitTime = additionalOptions.maxWaitTime || 300;
    const pollInterval = additionalOptions.pollInterval || 2;
    const baseUrl = credentials.baseUrl;
    const videoEndpoint = credentials.videoEndpoint;
    // Step 1: Create the video generation task
    const createBody = {
        model,
        content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
        ],
    };
    const createOptions = {
        method: 'POST',
        url: `${baseUrl}${videoEndpoint}`,
        body: createBody,
        json: true,
    };
    const createResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'bytePlusApi', createOptions);
    const taskId = (createResponse === null || createResponse === void 0 ? void 0 : createResponse.task_id) || (createResponse === null || createResponse === void 0 ? void 0 : createResponse.id);
    if (!taskId) {
        throw new Error('No task_id returned from video generation API');
    }
    // Step 2: Poll for task completion
    const pollUrl = `${baseUrl}${videoEndpoint}/${taskId}`;
    const startTime = Date.now();
    const deadline = startTime + maxWaitTime * 1000;
    while (Date.now() < deadline) {
        const pollOptions = {
            method: 'GET',
            url: pollUrl,
            json: true,
        };
        const pollResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'bytePlusApi', pollOptions);
        const status = (pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.status) ||
            (pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.task_status) ||
            (pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.state) ||
            'running';
        // Check if completed
        if (['succeeded', 'success', 'completed', 'done'].includes(status)) {
            const videoUrl = ((_a = pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.content) === null || _a === void 0 ? void 0 : _a.video_url) ||
                ((_c = (_b = pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.url) ||
                ((_d = pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.result) === null || _d === void 0 ? void 0 : _d.url) ||
                ((_f = (_e = pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.outputs) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.url) ||
                (pollResponse === null || pollResponse === void 0 ? void 0 : pollResponse.url);
            const elapsedTime = (Date.now() - startTime) / 1000;
            return {
                success: true,
                taskId,
                status: 'completed',
                prompt,
                referenceImageUrl: imageUrl,
                videoUrl,
                elapsedTime: `${elapsedTime.toFixed(1)}s`,
                rawResponse: pollResponse,
            };
        }
        // Check if failed
        if (['failed', 'error', 'canceled'].includes(status)) {
            throw new Error(`Video generation task failed: ${JSON.stringify(pollResponse)}`);
        }
        // Wait before next poll
        await sleep(pollInterval * 1000);
    }
    // Timeout reached
    throw new Error(`Video generation timed out after ${maxWaitTime} seconds. Task ID: ${taskId}`);
}
//# sourceMappingURL=generateVideo.operation.js.map