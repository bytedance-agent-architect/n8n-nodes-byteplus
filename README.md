# n8n-nodes-byteplus

This is an n8n community node for **BytePlus AI Services**, providing access to:

- **Image Generation** (Seedream)
- **Video Generation** (Seedance)
- **TikTok Publishing** (placeholder)

## Installation

### Community Node (Recommended)

1. Go to **Settings > Community Nodes** in n8n
2. Select **Install**
3. Enter `n8n-nodes-byteplus`
4. Agree to the risks and click **Install**

### Manual Installation

```bash
npm install n8n-nodes-byteplus
```

## Credentials

To use this node, you need a BytePlus ARK API Key:

1. Sign up at [BytePlus](https://www.byteplus.com/)
2. Navigate to the ARK console
3. Generate an API key
4. In n8n, go to **Credentials > New Credential > BytePlus API**
5. Enter your API key and configure endpoints if needed

## Operations

### Image Resource

#### Generate Image
Generate images from text prompts using Seedream.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | Text description of the image |
| Model | No | Model ID (uses default if empty) |
| Size | No | 2K, 1080p, 720p, or 1024x1024 |
| Watermark | No | Add watermark (default: true) |

**Example Output:**
```json
{
  "success": true,
  "prompt": "A beautiful sunset over mountains",
  "imageUrl": "https://...",
  "rawResponse": { ... }
}
```

### Video Resource

#### Generate Video
Generate videos from text and reference images using Seedance.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | Text description of the video |
| Reference Image URL | Yes | Public https:// URL of reference image |
| Model | No | Model ID (uses default if empty) |
| Max Wait Time | No | Polling timeout in seconds (default: 300) |

**Example Output:**
```json
{
  "success": true,
  "taskId": "task_123",
  "status": "completed",
  "videoUrl": "https://...",
  "elapsedTime": "45.2s"
}
```

### Sharing Resource

#### Publish to TikTok
Publish videos to TikTok. **Note: This is currently a placeholder implementation.**

| Parameter | Required | Description |
|-----------|----------|-------------|
| Video URL | Yes | URL of video to publish |
| Caption | No | Caption text for the post |
| Hashtags | No | Comma-separated hashtags |
| Privacy Level | No | public, friends, or private |

## Development

### Local Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the node:
   ```bash
   npm run build
   ```

### Running with Docker

Start n8n with the custom node:

```bash
docker-compose up
```

Access n8n at `http://localhost:5679`

### Project Structure

```
n8n-nodes-byteplus/
├── credentials/
│   └── BytePlusApi.credentials.ts    # API credentials
├── nodes/
│   └── BytePlus/
│       ├── BytePlus.node.ts          # Main node
│       ├── BytePlus.node.json        # Metadata
│       ├── byteplus.svg              # Icon
│       └── actions/
│           ├── Image/                # Image operations
│           ├── Video/                # Video operations
│           └── Sharing/              # Sharing operations
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

## API Reference

This node uses the following BytePlus ARK endpoints:

| Service | Endpoint |
|---------|----------|
| Image Generation (Seedream) | `/api/v3/images/generations` |
| Video Generation (Seedance) | `/api/v3/contents/generations/tasks` |

## License

MIT

## Links

- [BytePlus Documentation](https://www.byteplus.com/en/docs)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
