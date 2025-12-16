"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
exports.description = [
    {
        displayName: 'Video URL',
        name: 'videoUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['sharing'],
                operation: ['publishToTikTok'],
            },
        },
        description: 'URL of the video to publish to TikTok',
    },
    {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        default: '',
        displayOptions: {
            show: {
                resource: ['sharing'],
                operation: ['publishToTikTok'],
            },
        },
        description: 'Caption text for the TikTok post',
    },
    {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
            show: {
                resource: ['sharing'],
                operation: ['publishToTikTok'],
            },
        },
        options: [
            {
                displayName: 'Hashtags',
                name: 'hashtags',
                type: 'string',
                default: '',
                description: 'Comma-separated list of hashtags (without #)',
            },
            {
                displayName: 'Privacy Level',
                name: 'privacyLevel',
                type: 'options',
                options: [
                    { name: 'Public', value: 'public' },
                    { name: 'Friends Only', value: 'friends' },
                    { name: 'Private', value: 'private' },
                ],
                default: 'public',
                description: 'Who can view this video',
            },
            {
                displayName: 'Allow Comments',
                name: 'allowComments',
                type: 'boolean',
                default: true,
                description: 'Whether to allow comments on the video',
            },
            {
                displayName: 'Allow Duet',
                name: 'allowDuet',
                type: 'boolean',
                default: true,
                description: 'Whether to allow duets with this video',
            },
            {
                displayName: 'Allow Stitch',
                name: 'allowStitch',
                type: 'boolean',
                default: true,
                description: 'Whether to allow stitches with this video',
            },
        ],
    },
];
async function execute(index) {
    const videoUrl = this.getNodeParameter('videoUrl', index);
    const caption = this.getNodeParameter('caption', index, '');
    const additionalOptions = this.getNodeParameter('additionalOptions', index, {});
    // Parse hashtags
    const hashtagsString = additionalOptions.hashtags || '';
    const hashtags = hashtagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => `#${tag}`);
    // Build the full caption with hashtags
    const fullCaption = hashtags.length > 0
        ? `${caption}\n\n${hashtags.join(' ')}`
        : caption;
    // TODO: Implement TikTok API integration
    // TikTok Content Posting API documentation:
    // https://developers.tiktok.com/doc/content-posting-api-get-started
    //
    // Required steps:
    // 1. Register app on TikTok Developer Portal
    // 2. Implement OAuth 2.0 flow for user authentication
    // 3. Use POST /v2/post/publish/video/init/ to initialize upload
    // 4. Upload video chunks
    // 5. Use POST /v2/post/publish/ to publish
    return {
        success: false,
        message: 'TikTok publishing is not yet implemented',
        placeholder: true,
        videoUrl,
        caption: fullCaption,
        settings: {
            privacyLevel: additionalOptions.privacyLevel || 'public',
            allowComments: additionalOptions.allowComments !== false,
            allowDuet: additionalOptions.allowDuet !== false,
            allowStitch: additionalOptions.allowStitch !== false,
        },
        todo: [
            'Register app on TikTok Developer Portal',
            'Add TikTok OAuth credentials to n8n',
            'Implement video upload flow',
            'Implement publish API call',
        ],
    };
}
//# sourceMappingURL=publishToTikTok.operation.js.map