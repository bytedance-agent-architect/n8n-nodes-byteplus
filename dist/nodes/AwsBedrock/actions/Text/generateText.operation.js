"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
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
        description: 'The prompt to send to the model',
    },
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        options: [
            { name: 'Amazon Nova Lite', value: 'amazon.nova-lite-v1:0' },
            { name: 'Amazon Nova Micro', value: 'amazon.nova-micro-v1:0' },
            { name: 'Amazon Nova Pro', value: 'amazon.nova-pro-v1:0' },
            { name: 'Claude 3.5 Sonnet', value: 'anthropic.claude-3-5-sonnet-20241022-v2:0' },
            { name: 'Claude 3 Haiku', value: 'anthropic.claude-3-haiku-20240307-v1:0' },
            { name: 'Claude 3 Sonnet', value: 'anthropic.claude-3-sonnet-20240229-v1:0' },
            { name: 'Llama 3.1 8B Instruct', value: 'meta.llama3-1-8b-instruct-v1:0' },
            { name: 'Llama 3.1 70B Instruct', value: 'meta.llama3-1-70b-instruct-v1:0' },
            { name: 'Mistral 7B Instruct', value: 'mistral.mistral-7b-instruct-v0:2' },
        ],
        default: 'amazon.nova-lite-v1:0',
        displayOptions: {
            show: {
                resource: ['text'],
                operation: ['generateText'],
            },
        },
        description: 'The model to use for text generation',
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
                displayName: 'System Prompt',
                name: 'systemPrompt',
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
                    maxValue: 1,
                    numberStepSize: 0.1,
                },
                default: 0.7,
                description: 'Controls randomness (0 = deterministic, 1 = very random)',
            },
            {
                displayName: 'Max Tokens',
                name: 'maxTokens',
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
                default: 0.9,
                description: 'Nucleus sampling parameter',
            },
        ],
    },
];
// AWS Signature Version 4 signing functions
function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    return kSigning;
}
function sign(key, msg) {
    return crypto.createHmac('sha256', key).update(msg, 'utf8').digest();
}
function sha256(data) {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}
async function execute(index) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const credentials = await this.getCredentials('awsBedrockApi');
    const prompt = this.getNodeParameter('prompt', index);
    const model = this.getNodeParameter('model', index);
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    const accessKeyId = credentials.accessKeyId;
    const secretAccessKey = credentials.secretAccessKey;
    const region = credentials.region;
    // Determine if it's an Anthropic model (uses different API format)
    const isAnthropicModel = model.startsWith('anthropic.');
    const isAmazonModel = model.startsWith('amazon.');
    const isMetaModel = model.startsWith('meta.');
    const isMistralModel = model.startsWith('mistral.');
    // Build request body based on model type
    let requestBody;
    if (isAnthropicModel) {
        // Anthropic Claude models use Messages API format
        requestBody = {
            anthropic_version: 'bedrock-2023-05-31',
            max_tokens: additionalOptions.maxTokens || 1024,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        };
        if (additionalOptions.systemPrompt) {
            requestBody.system = additionalOptions.systemPrompt;
        }
        if (additionalOptions.temperature !== undefined) {
            requestBody.temperature = additionalOptions.temperature;
        }
        if (additionalOptions.topP !== undefined) {
            requestBody.top_p = additionalOptions.topP;
        }
    }
    else if (isAmazonModel) {
        // Amazon Nova models
        const messages = [
            {
                role: 'user',
                content: [{ text: prompt }],
            },
        ];
        requestBody = {
            messages,
            inferenceConfig: {
                maxTokens: additionalOptions.maxTokens || 1024,
                temperature: (_a = additionalOptions.temperature) !== null && _a !== void 0 ? _a : 0.7,
                topP: (_b = additionalOptions.topP) !== null && _b !== void 0 ? _b : 0.9,
            },
        };
        if (additionalOptions.systemPrompt) {
            requestBody.system = [{ text: additionalOptions.systemPrompt }];
        }
    }
    else if (isMetaModel) {
        // Meta Llama models
        requestBody = {
            prompt: additionalOptions.systemPrompt
                ? `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${additionalOptions.systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`
                : `<|begin_of_text|><|start_header_id|>user<|end_header_id|>\n\n${prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
            max_gen_len: additionalOptions.maxTokens || 1024,
            temperature: (_c = additionalOptions.temperature) !== null && _c !== void 0 ? _c : 0.7,
            top_p: (_d = additionalOptions.topP) !== null && _d !== void 0 ? _d : 0.9,
        };
    }
    else if (isMistralModel) {
        // Mistral models
        requestBody = {
            prompt: additionalOptions.systemPrompt
                ? `<s>[INST] ${additionalOptions.systemPrompt}\n\n${prompt} [/INST]`
                : `<s>[INST] ${prompt} [/INST]`,
            max_tokens: additionalOptions.maxTokens || 1024,
            temperature: (_e = additionalOptions.temperature) !== null && _e !== void 0 ? _e : 0.7,
            top_p: (_f = additionalOptions.topP) !== null && _f !== void 0 ? _f : 0.9,
        };
    }
    else {
        // Default format
        requestBody = {
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: additionalOptions.maxTokens || 1024,
                temperature: (_g = additionalOptions.temperature) !== null && _g !== void 0 ? _g : 0.7,
                topP: (_h = additionalOptions.topP) !== null && _h !== void 0 ? _h : 0.9,
            },
        };
    }
    const body = JSON.stringify(requestBody);
    const host = `bedrock-runtime.${region}.amazonaws.com`;
    // For the canonical URI used in signing, we need URI-encoded model (%3A for colon)
    const canonicalModelId = encodeURIComponent(model);
    // For the actual URL we send, use the raw model - axios will encode it
    const endpoint = `https://${host}/model/${model}/invoke`;
    // Create date strings for signing
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    // Create canonical request
    const method = 'POST';
    // Canonical URI must use URI-encoded model ID (what AWS expects after encoding)
    const canonicalUri = `/model/${canonicalModelId}/invoke`;
    const canonicalQuerystring = '';
    const payloadHash = sha256(body);
    const canonicalHeaders = `accept:application/json\n` +
        `content-type:application/json\n` +
        `host:${host}\n` +
        `x-amz-date:${amzDate}\n`;
    const signedHeaders = 'accept;content-type;host;x-amz-date';
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/bedrock/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`;
    // Calculate signature
    const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, 'bedrock');
    const signature = sign(signingKey, stringToSign).toString('hex');
    // Create authorization header
    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    // Make the request using axios directly to prevent URL re-encoding
    let response;
    try {
        const axiosResponse = await (0, axios_1.default)({
            method: 'POST',
            url: endpoint,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Amz-Date': amzDate,
                'Authorization': authorizationHeader,
            },
            data: body,
        });
        response = axiosResponse.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && error.response) {
            const errMsg = JSON.stringify(error.response.data);
            throw new Error(`AWS Bedrock Error (${error.response.status}): ${errMsg}`);
        }
        throw error;
    }
    // Extract text from response based on model type
    let generatedText = null;
    if (isAnthropicModel) {
        generatedText = ((_k = (_j = response === null || response === void 0 ? void 0 : response.content) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.text) || null;
    }
    else if (isAmazonModel) {
        generatedText = ((_p = (_o = (_m = (_l = response === null || response === void 0 ? void 0 : response.output) === null || _l === void 0 ? void 0 : _l.message) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.text) || null;
    }
    else if (isMetaModel) {
        generatedText = (response === null || response === void 0 ? void 0 : response.generation) || null;
    }
    else if (isMistralModel) {
        generatedText = ((_r = (_q = response === null || response === void 0 ? void 0 : response.outputs) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.text) || null;
    }
    else {
        generatedText = ((_t = (_s = response === null || response === void 0 ? void 0 : response.results) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.outputText) || null;
    }
    return {
        success: true,
        prompt,
        model,
        generatedText,
        usage: (response === null || response === void 0 ? void 0 : response.usage) || (response === null || response === void 0 ? void 0 : response.amazon_bedrock_invocationMetrics) || null,
        rawResponse: response,
    };
}
//# sourceMappingURL=generateText.operation.js.map