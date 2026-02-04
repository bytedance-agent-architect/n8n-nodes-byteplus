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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TikTok = void 0;
const video = __importStar(require("./actions/Video"));
class TikTok {
    constructor() {
        this.description = {
            displayName: 'TikTok',
            name: 'tikTok',
            icon: 'file:tiktok.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Upload videos to TikTok',
            defaults: {
                name: 'TikTok',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'tiktokOAuth2Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Video',
                            value: 'video',
                            description: 'Upload videos to TikTok',
                        },
                    ],
                    default: 'video',
                },
                ...video.description,
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                if (resource === 'video') {
                    responseData = await video.execute.call(this, i, operation);
                }
                if (responseData) {
                    if (Array.isArray(responseData)) {
                        returnData.push(...responseData);
                    }
                    else if (responseData.json !== undefined) {
                        returnData.push(responseData);
                    }
                    else {
                        returnData.push({ json: responseData });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.TikTok = TikTok;
//# sourceMappingURL=TikTok.node.js.map